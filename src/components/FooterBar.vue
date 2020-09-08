<template>
  <footer class="footer">
    <div v-if="mode === 'read'" class="vuln-read-options">
      <button class="akt-btn akt-btn--primary" v-on:click="startWrite()">
        Start Translation
      </button>
      <!-- <button class="akt-btn akt-btn--secondary">Edit Vulnerabilities</button> -->
    </div>
    <div v-if="mode === 'write'" class="vuln-read-options">
      <button
        class="akt-btn akt-btn--primary"
        @click="showSaveModal"
        :disabled="modifiedVulnerabilitiesCount == 0"
      >
        Save Changes ({{ modifiedVulnerabilitiesCount }})
      </button>
      <button
        class="akt-btn akt-btn--secondary"
        @click="submitForReview"
        :disabled="commitCount == 0"
      >
        Submit for Review
      </button>
    </div>

    <modal-dialog v-show="isModalVisible" @close="closeModal">
      <template v-slot:header><h4>Save changes</h4></template>
      <template v-slot:body>
        <div v-if="modifiedVulnerabilitiesCount > 0">
          <div class="commit__status">
            <div>
              Make sure to save after each vulnerability's translation change.
            </div>
          </div>
          <div class="commit">
            <div class="commit__label">
              <strong>What did you change?</strong>
            </div>
            <div class="commit__edit">
              <textarea
                class="commit__textarea"
                rows="2"
                v-model="commitMsg"
                placeholder="Eg: Updated ja translations: 55 & 110"
              ></textarea>
              <div class="commit__error">{{ commitValidationMsg }}</div>
            </div>
          </div>
        </div>
        <div v-else class="commit__empty">No local changes to save!</div>
      </template>
      <template v-slot:footer v-if="modifiedVulnerabilitiesCount > 0">
        <button
          class="akt-btn akt-btn--icon akt-btn--primary commit__btn"
          @click="commitChanges()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
            viewBox="0 0 24 24"
          >
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"
            />
          </svg>
          <span>Save</span>
        </button>
      </template>
    </modal-dialog>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import RepoBranchService from "@/services/RepoBranchService";
import GithubRepoBranchResponse from "@/types/github/GithubRepoBranchResponse";
import ModalDialog from "@/components/ModalDialog.vue";

@Component({
  components: {
    ModalDialog
  }
})
export default class FooterBar extends Vue {
  private branch = "master";
  private mode = "read";
  private username = localStorage.getItem("username");

  private commitMsg = "";
  private commitValidationMsg = "";
  private commitCount = 0;
  private isModalVisible = false;

  private modifiedVulnerabilitiesCount = 0;
  private modifiedVulnerabilitiesIds: number[] = [];

  @Watch("$store.state.modifiedVulnerabilitiesCounter")
  private watchModifiedVulnerabilities() {
    this.getModifiedVulnerabilitiesCount();
  }

  showSaveModal() {
    this.getModifiedVulnerabilitiesCount();
    this.isModalVisible = true;
    // this.getModifiedVulnerabilities();
    this.commitMsg = `Updated ja translations for vulnerabilities ${this.modifiedVulnerabilitiesIds
      .slice(0, 10)
      .join(", ")}${
      this.modifiedVulnerabilitiesIds.length > 10 ? " & more" : ""
    }`;
  }
  closeModal() {
    this.isModalVisible = false;
  }
  commitChanges() {
    if (!this.modifiedVulnerabilitiesCount) {
      this.closeModal();
      this.$toast.warning("No changes to save");
      return;
    }
    if (!this.commitMsg) {
      this.commitValidationMsg = "This cannot be empty";
      return;
    }
    if (this.commitMsg.length < 5) {
      this.commitValidationMsg = "Atleast 5 characters is required";
      return;
    }
    this.closeModal();
    this.commitMsg = "";
    this.commitValidationMsg = "";
    this.getModifiedVulnerabilitiesCount();
    const commitCount = localStorage.getItem("commitCount") || "0";
    this.commitCount = parseInt(commitCount) + 1;
    localStorage.setItem("commitCount", this.commitCount + "");
    this.$toast.success("Changes saved");
  }

  submitForReview() {
    this.$toast("I'm a toast!");
  }

  getModifiedVulnerabilities() {
    const modifiedVulnerabilities = localStorage.getItem(
      "modifiedVulnerabilities"
    );
    if (!modifiedVulnerabilities) {
      this.modifiedVulnerabilitiesIds = [];
      return [];
    }
    const mvs = JSON.parse(modifiedVulnerabilities);
    const vArr: string[] = Object.keys(mvs.ja);
    const idsList = vArr
      .filter(k => mvs.ja[parseInt(k)].vulnerability)
      .map(k => {
        return parseInt(k);
      });
    this.modifiedVulnerabilitiesIds = idsList;
    return idsList;
  }

  getModifiedVulnerabilitiesCount() {
    this.modifiedVulnerabilitiesCount = this.getModifiedVulnerabilities().length;
  }

  async getBranch() {
    const branch = localStorage.getItem("branch");
    if (branch) {
      this.branch = branch;
      return this.branch;
    }

    return RepoBranchService.getAll("vulnerabilities").then(async response => {
      const branches: GithubRepoBranchResponse[] = response.data;
      const regex = RegExp(`akt-${this.username}-[0-9]+`);
      const userBranches = branches
        .filter(b => b.protected == false)
        .filter(b => regex.test(b.name));
      if (userBranches && userBranches[0]) {
        localStorage.setItem("branch", userBranches[0].name);
        this.branch = userBranches[0].name;
        return this.branch;
      }

      return this.branch;
    });
  }

  setMode() {
    if (this.branch !== "master") {
      this.mode = "write";
    }
  }

  async createBranch(newBranchName: string) {
    const masterHash = await RepoBranchService.getReferenceBranchHash(
      "vulnerabilities",
      "master"
    ).then(async response => {
      return response.data.object.sha;
    });

    await RepoBranchService.create(
      "vulnerabilities",
      newBranchName,
      masterHash
    ).then(async response => {
      return response.data;
    });

    localStorage.setItem("branch", newBranchName);
    return;
  }

  async startWrite() {
    this.getBranch();
    this.setMode();

    if (this.branch !== "master") {
      return;
    }
    const newBranchName = `akt-${this.username}-${Date.now()}`;
    await this.createBranch(newBranchName);
    return;
  }

  mounted() {
    this.getBranch();
    this.setMode();
    this.getModifiedVulnerabilitiesCount();
  }
}
</script>

<style scoped lang="scss">
.footer {
  height: 100%;
}

.vuln-read-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  margin-right: 1.5rem;
  margin-left: 1.5rem;
  & > * {
    margin-left: 0.5rem;
  }
}

.commit {
  padding: 0.8rem 1.15rem 0;
  &__status {
    font-style: italic;
    padding: 0.5rem 1rem;
    border: 1px solid lighten($color-primary, 30%);
    background: lighten($color-primary, 35%);
    color: $color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__label {
    padding-bottom: 0.8em;
  }
  &__textarea {
    width: 100%;
    border: 2px solid darken($color-bg, 10%);
    border-radius: $border-radius;
    font-size: 0.9rem;
    font-family: inherit;
    padding: 0.2rem 0.5rem;
  }
  &__error {
    color: $color-error;
    font-size: 0.8rem;
  }
  &__btn {
    font-size: 0.95rem;
  }
  &__empty {
    text-align: center;
    padding: 2rem 1rem 0.5rem;
  }
}
</style>

<template>
  <footer class="footer">
    <div v-if="mode === 'read'" class="vuln-read-options">
      <button class="akt-btn akt-btn--primary" v-on:click="startWrite()">
        Start Translation
      </button>
      <!-- <button class="akt-btn akt-btn--secondary">Edit Vulnerabilities</button> -->
    </div>
    <div v-if="mode === 'write'" class="vuln-read-options">
      <button class="akt-btn akt-btn--primary" @click="showModal">
        Save Changes
      </button>
      <button class="akt-btn akt-btn--secondary">Submit for Review</button>
    </div>

    <modal-dialog v-show="isModalVisible" @close="closeModal">
      <template v-slot:header><h4>Save changes</h4></template>
      <template v-slot:body>
        <!-- <div class="commit__status">
          <div>
            Includes translation modifications of
            {{ modifiedVulnerabilitiesCount }} vulnerabilities
          </div>
        </div> -->
        <div class="commit">
          <div class="commit__label"><strong>What did you change?</strong></div>
          <div class="commit__edit">
            <textarea
              class="commit__textarea"
              rows="3"
              v-model="commitMsg"
              placeholder="Eg: Updated ja translations: 55 & 110"
            ></textarea>
            <div class="commit__error">{{ commitValidationMsg }}</div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button class="akt-btn akt-btn--primary" @click="commitChanges()">
          Save
        </button>
      </template>
    </modal-dialog>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
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
  private isModalVisible = false;

  private modifiedVulnerabilitiesCount = 0;
  private modifiedVulnerabilitiesIds: number[] = [];

  showModal() {
    this.isModalVisible = true;
    this.getModifiedVulnerabilitiesCount();
    this.getModifiedVulnerabilities();
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
    &::placeholder {
      color: #a8a8a8;
      opacity: 1; /* Firefox */
    }
  }
  &__error {
    color: $color-error;
    font-size: 0.8rem;
    // font-style: ;
  }
}
</style>

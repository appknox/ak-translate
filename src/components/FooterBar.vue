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
        @click="showCommitModal"
        :disabled="modifiedVulnerabilitiesCount == 0 || isCommitting"
      >
        <span v-if="isCommitting">Saving...</span>
        <span v-else>Save Changes ({{ modifiedVulnerabilitiesCount }})</span>
      </button>
      <button
        class="akt-btn akt-btn--secondary"
        @click="showPRModal"
        :disabled="!isSubmissible"
      >
        Submit for Review
      </button>
    </div>

    <modal-dialog v-show="isCommitModalVisible" @close="closeCommitModal">
      <template v-slot:header><h4>Save Changes</h4></template>
      <template v-slot:body>
        <div v-if="modifiedVulnerabilitiesCount > 0">
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

    <modal-dialog v-show="isPRModalVisible" @close="closePRModal">
      <template v-slot:header><h4>Submit for Review</h4></template>
      <template v-slot:body>
        <div class="pr">
          <div v-if="!isSubmissible">
            You have unsaved changes in translations. Save those changes before
            submitting for review.
          </div>
          <div v-else>
            <div v-if="commitCount > 0">
              <div>
                Submit vulnerability translations for review. Appknox report &
                dashboard translations will be updated once admin approve these
                changes.
              </div>
              <div class="pr__status">
                <div>
                  <div>
                    Author: <strong>{{ editor }}</strong>
                  </div>
                  <div>
                    Translation Session ID: <strong>{{ branch }}</strong>
                  </div>
                  <div>
                    <strong>{{ commitCount }}</strong> saved changes.
                  </div>
                </div>
              </div>
              <div class="pr__label">
                <strong>Any notes?</strong>
              </div>
              <div class="pr__edit">
                <textarea
                  class="pr__textarea"
                  rows="2"
                  v-model="prMsg"
                ></textarea>
              </div>
            </div>
            <div v-else class="pr__empty">
              You don't have any saved changes to review!
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer v-if="isSubmissible">
        <button
          class="akt-btn akt-btn--icon akt-btn--secondary pr__btn"
          @click="submitPR()"
        >
          <span>Submit</span>
        </button>
      </template>
    </modal-dialog>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import RepoBranchService from "@/services/RepoBranchService";
import ModalDialog from "@/components/ModalDialog.vue";
import RepoContentService from "@/services/RepoContentService";
import RepoPullService from "@/services/RepoPullService";
import GithubRepoContentResponse from "@/types/github/GithubRepoContentResponse";
import GithubRepoBranchResponse from "@/types/github/GithubRepoBranchResponse";
import { Base64 } from "js-base64";

@Component({
  components: {
    ModalDialog
  }
})
export default class FooterBar extends Vue {
  private branch = localStorage.getItem("branch") || "";
  private username = localStorage.getItem("username");
  private editor = localStorage.getItem("editor");

  private isCommitModalVisible = false;
  private isPRModalVisible = false;

  private mode = "read";
  private commitCount = 0;
  private commitMsg = "";
  private commitValidationMsg = "";
  private isCommitting = false;
  private prMsg = "";
  private modifiedVulnerabilitiesCount = 0;
  private modifiedVulnerabilitiesIds: number[] = [];
  private isSubmissible = false;

  @Watch("$store.state.modifiedVulnerabilitiesCounter")
  private watchModifiedVulnerabilities() {
    this.getModifiedVulnerabilitiesCount();
    this.isPRSubmissible();
  }

  isPRSubmissible() {
    this.isSubmissible =
      this.modifiedVulnerabilitiesCount == 0 && this.commitCount > 0;
    return;
  }

  showCommitModal() {
    this.getModifiedVulnerabilitiesCount();
    this.isCommitModalVisible = true;
    this.commitMsg = `Updated ja translations for vulnerabilities ${this.modifiedVulnerabilitiesIds
      .slice(0, 10)
      .join(", ")}${
      this.modifiedVulnerabilitiesIds.length > 10 ? " & more" : ""
    }`;
  }
  closeCommitModal() {
    this.isCommitModalVisible = false;
  }

  async commitTranslationsToGithub() {
    const REPO = "vulnerabilities";
    const lang = "ja";
    const langDir = `locales/${lang}`;
    const RAW_BASE_URL = `https://raw.githubusercontent.com/appknox/vulnerabilities/${this.branch}`;

    const fieldFileMap = {
      name: "name",
      question: "question",
      summary: "description",
      description: "intro",
      businessImplication: "business_implication",
      compliant: "compliant",
      nonCompliant: "non_compliant",
      successMessage: "success_message",
      relatedTo: "related_to"
    };

    const mvList = this.getModifiedVulnerabilities();

    for (const id in mvList) {
      const origVuln = this.$store.getters.getVulnerability(id, lang);
      const modifiedVuln = mvList[id];
      const vulnUrl = `${RAW_BASE_URL}/${langDir}/${origVuln.key}`;
      for (const field in modifiedVuln.vulnerability) {
        const remoteFile: GithubRepoContentResponse = await RepoContentService.get(
          REPO,
          this.branch,
          `${langDir}/${origVuln.key}/${fieldFileMap[field]}.md`
        ).then(response => response.data);

        await RepoContentService.put(
          REPO,
          this.branch,
          `${langDir}/${origVuln.key}/${fieldFileMap[field]}.md`,
          Base64.encode(mvList[id].vulnerability[field]),
          remoteFile.sha,
          `Updated ${fieldFileMap[field]} of vulnerability ${id} translation`
        );

        const response = await fetch(`${vulnUrl}/${fieldFileMap[field]}.md`);
        const content = await response.text();
        await this.$store.commit("updateVulnerabilityField", {
          lang: `${lang}`,
          id: origVuln.id,
          field: field,
          value: content
        });
      }
      this.$store.commit("saveModifiedVulnerability", {
        lang,
        id,
        hash: mvList[id].hash,
        vulnerability: null
      });
    }
    const modifiedVulnerabilities = this.$store.getters
      .getModifiedVulnerabilities;
    localStorage.setItem(
      "modifiedVulnerabilities",
      JSON.stringify(modifiedVulnerabilities)
    );
    const vulnerabilities = this.$store.getters.getVulnerabilities;
    localStorage.setItem("vulnerabilities", JSON.stringify(vulnerabilities));
  }

  commitChanges() {
    if (!this.modifiedVulnerabilitiesCount) {
      this.closeCommitModal();
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

    try {
      this.isCommitting = true;
      this.commitTranslationsToGithub();
      this.closeCommitModal();
      this.commitMsg = "";
      this.commitValidationMsg = "";
      this.getModifiedVulnerabilitiesCount();
      const commitCount = localStorage.getItem("commitCount") || "0";
      this.commitCount = parseInt(commitCount) + 1;
      localStorage.setItem("commitCount", this.commitCount + "");
      this.$toast.success("Changes saved");
      this.$router.push(`/vulnerabilities/${this.$route.params.id}`);
    } catch (e) {
      this.$toast.error("Something went wrong during save. Please try again.");
    } finally {
      this.isCommitting = false;
    }
  }

  showPRModal() {
    this.getModifiedVulnerabilitiesCount();
    this.isPRModalVisible = true;
  }
  closePRModal() {
    this.isPRModalVisible = false;
  }
  submitPR() {
    try {
      this.submitPullRequest();
      this.isPRModalVisible = false;
      this.commitCount = 0;
      // TODO: this.branch = "";
      this.$toast.success("Sumitted for review");
      this.$router.push("/projects");
    } catch (e) {
      this.$toast.error(
        "Something went wrong during submission for review. Please try again."
      );
    }
  }

  async submitPullRequest() {
    return await RepoPullService.post(
      "vulnerabilities",
      this.branch,
      "Updated ja traslations via ak-translate",
      `Author: ${this.editor}\n\n${this.prMsg}`
    );
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
    const keyList = vArr.filter(k => mvs.ja[parseInt(k)].vulnerability);
    const mvList = keyList.reduce((acc, curr) => {
      acc[curr] = mvs.ja[curr];
      return acc;
    }, {});
    this.modifiedVulnerabilitiesIds = keyList.map(k => parseInt(k));
    return mvList;
  }

  getModifiedVulnerabilitiesCount() {
    this.getModifiedVulnerabilities();
    this.modifiedVulnerabilitiesCount = this.modifiedVulnerabilitiesIds.length;
  }

  async getBranch() {
    const branch = localStorage.getItem("branch");
    if (branch) {
      this.$store.commit("saveBranch", branch);
      this.branch = branch;
      return this.branch;
    }

    const editor = localStorage.getItem("editor");
    if (editor) {
      this.$store.commit("saveEditor", editor);
      this.editor = editor;
    } else {
      this.editor = this.username;
    }

    return RepoBranchService.getAll("vulnerabilities").then(async response => {
      const branches: GithubRepoBranchResponse[] = response.data;
      const regex = RegExp(`akt-${this.editor}-[0-9]+`);
      const userBranches = branches
        .filter(b => b.protected == false)
        .filter(b => regex.test(b.name));
      if (userBranches && userBranches[0]) {
        localStorage.setItem("branch", userBranches[0].name);
        this.branch = userBranches[0].name;
        this.$store.commit("saveBranch", this.branch);
        return this.branch;
      }

      return this.branch;
    });
  }

  getEditor() {
    const editor = localStorage.getItem("editor");
    if (editor) {
      this.$store.commit("saveEditor", editor);
      this.editor = editor;
    } else {
      this.editor = this.username;
    }
  }

  getCommitCount() {
    const cc = localStorage.getItem("commitCount");
    if (cc) {
      const commitCount = parseInt(cc);
      this.$store.commit("saveCommitCount", commitCount);
      this.commitCount = commitCount;
    }
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

    this.$store.commit("saveBranch", newBranchName);
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
    this.getEditor();
    this.getCommitCount();
    this.setMode();
    this.getModifiedVulnerabilitiesCount();
    this.isPRSubmissible();
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

.pr {
  padding: 0.8rem 1.15rem 0;
  &__status {
    font-size: 0.8rem;
    line-height: 1.6;
    padding: 1rem 0;
    display: flex;
    align-items: flex-start;
    width: 100%;
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

<template>
  <footer class="footer">
    <div class="footer__left">
      <slot name="faq"></slot>
    </div>
    <div class="footer__right">
      <div v-if="mode === 'read'" class="vuln-read-options">
        <button
          class="akt-btn akt-btn--icon-text akt-btn--primary"
          v-on:click="startWrite()"
        >
          <translate-icon />
          <span class="akt-btn--icon-text__label">Start Translation</span>
        </button>
      </div>
      <div v-if="mode === 'write'" class="vuln-read-options">
        <button
          class="akt-btn akt-btn--primary"
          @click="showCommitModal"
          :disabled="modifiedVulnerabilitiesCount == 0 || isCommitting"
        >
          <span v-if="isCommitting">Saving...</span>
          <span v-else>
            <cloud-upload-icon />
            <span class="akt-btn--icon-text__label"
              >Save Changes ({{ modifiedVulnerabilitiesCount }})</span
            >
          </span>
        </button>
        <button
          v-if="modifiedVulnerabilitiesCount > 0"
          class="akt-btn akt-btn--icon akt-btn--clear--secondary"
          @click="showDiscardModal"
          title="Discard unsaved changes"
        >
          <restore-icon />
        </button>
        <button
          class="akt-btn akt-btn--secondary"
          @click="showPRModal"
          :disabled="!isSubmissible"
        >
          <submit-icon />
          <span class="akt-btn--icon-text__label">Submit for Review</span>
        </button>
      </div>
    </div>

    <modal-dialog v-show="isCommitModalVisible" @close="closeCommitModal">
      <template v-slot:header><h4>Save Changes</h4></template>
      <template v-slot:body>
        <div v-if="modifiedVulnerabilitiesCount > 0">
          <div class="commit">
            <div class="commit__label">{{ commitMsg }}</div>
          </div>
        </div>
        <div v-else class="commit__empty">No local changes to save!</div>
      </template>
      <template v-slot:footer v-if="modifiedVulnerabilitiesCount > 0">
        <button
          class="akt-btn akt-btn--icon-text akt-btn--primary commit__btn"
          @click="commitChanges()"
        >
          <cloud-upload-icon />
          <span class="akt-btn--icon-text__label">Save</span>
        </button>
      </template>
    </modal-dialog>

    <modal-dialog v-show="isDiscardModalVisible" @close="closeDiscardModal">
      <template v-slot:header><h4>Discard unsaved changes</h4></template>
      <template v-slot:body>
        <div class="modal-body">
          <div v-if="modifiedVulnerabilitiesCount > 0">
            Translation chanes you made in
            {{ modifiedVulnerabilitiesCount }} vulnerabilities since the last
            save would be lost. Do you want to delete?
          </div>
          <div v-else>No local changes to discard!</div>
        </div>
      </template>
      <template v-slot:footer v-if="modifiedVulnerabilitiesCount > 0">
        <button
          class="akt-btn akt-btn--clear--default commit__btn"
          @click="closeDiscardModal()"
        >
          <span>Cancel</span>
        </button>
        <button
          class="akt-btn akt-btn--icon-text akt-btn--secondary commit__btn"
          @click="discardChanges()"
        >
          <delete-forever-icon />
          <span class="akt-btn--icon-text__label">Delete</span>
        </button>
      </template>
    </modal-dialog>

    <modal-dialog v-show="isPRModalVisible" @close="closePRModal">
      <template v-slot:header><h4>Finish translating</h4></template>
      <template v-slot:body>
        <div class="modal-body">
          <div v-if="!isSubmissible">
            You have unsaved changes in translations. Save those changes before
            submitting for review.
          </div>
          <div v-else>
            <div v-if="commitCount > 0">
              <div>
                Done with translations editing? Submit your changes for review.
              </div>
              <div class="pr__notice">
                Appknox report & dashboard translations will be updated once
                admin approve these changes.
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
                <strong>Any notes for the reviewer?</strong>
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
          class="akt-btn akt-btn--icon akt-btn--success pr__btn"
          @click="submitPR()"
        >
          <submit-icon />
          <span class="akt-btn--icon-text__label">Submit for Review</span>
        </button>
      </template>
    </modal-dialog>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Base64 } from "js-base64";
import RestoreIcon from "vue-material-design-icons/Restore.vue";
import TranslateIcon from "vue-material-design-icons/Translate.vue";
import CloudUploadIcon from "vue-material-design-icons/CloudUpload.vue";
import DeleteForeverIcon from "vue-material-design-icons/DeleteForever.vue";
import SubmitIcon from "vue-material-design-icons/TextBoxCheckOutline.vue";
import RepoBranchService from "@/services/RepoBranchService";
import RepoContentService from "@/services/RepoContentService";
import RepoPullService from "@/services/RepoPullService";
import GithubRepoContentResponse from "@/types/github/GithubRepoContentResponse";
import GithubRepoBranchResponse from "@/types/github/GithubRepoBranchResponse";
import ModalDialog from "@/components/ModalDialog.vue";

@Component({
  components: {
    ModalDialog,
    RestoreIcon,
    CloudUploadIcon,
    DeleteForeverIcon,
    TranslateIcon,
    SubmitIcon
  }
})
export default class FooterBar extends Vue {
  @Prop() private language!: string;

  private branch = localStorage.getItem("branch") || "";
  private username = localStorage.getItem("username");
  private editor = localStorage.getItem("editor");

  private isCommitModalVisible = false;
  private isPRModalVisible = false;
  private isDiscardModalVisible = false;

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
    this.commitMsg = `You have modified ${
      this.language
    } translations for vulnerabilities ${this.modifiedVulnerabilitiesIds
      .slice(0, 10)
      .join(", ")}${
      this.modifiedVulnerabilitiesIds.length > 10 ? " & more" : ""
    }. Save now?`;
  }
  closeCommitModal() {
    this.isCommitModalVisible = false;
  }

  async commitTranslationsToGithub() {
    const REPO = "vulnerabilities";
    const lang = this.language;
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
      const token = localStorage.getItem("token") || "";
      for (const field in modifiedVuln.vulnerability) {
        const remoteFile: GithubRepoContentResponse = await RepoContentService.get(
          token,
          REPO,
          this.branch,
          `${langDir}/${origVuln.key}/${fieldFileMap[field]}.md`
        ).then(response => response.data);

        await RepoContentService.put(
          token,
          REPO,
          this.branch,
          `${langDir}/${origVuln.key}/${fieldFileMap[field]}.md`,
          Base64.encode(mvList[id].vulnerability[field].content),
          remoteFile.sha,
          `Updated ${fieldFileMap[field]} of vulnerability ${id} ${this.language} translation`
        ).catch(err => {
          if (err.response.status == 401) {
            this.$toast.error("Could not authenticate");
            this.$router.push({ name: "login" });
          } else {
            this.$toast.error("Save failed. Please try again");
          }
        });

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
      this.$router
        .push(`/vulnerabilities/${this.$route.params.id}`)
        .catch(() => undefined);
    } catch (e) {
      this.$toast.error("Something went wrong during save. Please try again.");
    } finally {
      this.isCommitting = false;
    }
  }

  showDiscardModal() {
    this.getModifiedVulnerabilitiesCount();
    this.isDiscardModalVisible = true;
  }

  closeDiscardModal() {
    this.isDiscardModalVisible = false;
  }
  discardChanges() {
    this.$store.commit("resetModifiedVulnerabilities");
    const modifiedVulnerabilities = this.$store.getters
      .getModifiedVulnerabilities;
    localStorage.setItem(
      "modifiedVulnerabilities",
      JSON.stringify(modifiedVulnerabilities)
    );

    this.closeDiscardModal();
    this.$toast.error("Local changes cleared");
    this.$router
      .push(`/vulnerabilities/${this.$route.params.id}`)
      .catch(() => undefined);
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
      this.$store.commit("resetModifiedVulnerabilities");

      this.isPRModalVisible = false;

      this.commitCount = 0;
      this.$store.commit("saveCommitCount", this.commitCount);
      localStorage.setItem("commitCount", this.commitCount + "");

      this.branch = "master";
      this.$store.commit("saveBranch", this.branch);
      localStorage.setItem("branch", this.branch);

      this.$toast.success("Succesfully submitted for review. Thank you!", {
        timeout: false
      });
      this.$router.push("/projects");
    } catch (e) {
      this.$toast.error(
        "Something went wrong during submission for review. Please try again."
      );
    }
  }

  async submitPullRequest() {
    const token = localStorage.getItem("token") || "";
    return await RepoPullService.post(
      token,
      "vulnerabilities",
      this.branch,
      `Updated ${this.language} traslations via ak-translate`,
      `Author: ${this.editor}\n\n${this.prMsg}`
    ).catch(err => {
      if (err.response.status == 401) {
        this.$toast.error("Could not authenticate");
        this.$router.push({ name: "login" });
      } else {
        this.$toast.error("Submission failed. Please try again");
      }
      return;
    });
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
    const vArr: string[] = Object.keys(mvs[this.language]);
    const keyList = vArr.filter(
      k => mvs[this.language][parseInt(k)].vulnerability
    );
    const mvList = keyList.reduce((acc, curr) => {
      acc[curr] = mvs[this.language][curr];
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

    const token = localStorage.getItem("token") || "";
    return RepoBranchService.getAll(token, "vulnerabilities")
      .then(async response => {
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
      })
      .catch(err => {
        if (err.response.status == 401) {
          this.$toast.error("Could not authenticate");
          this.$router.push({ name: "login" });
        } else {
          this.$toast.error("Something went wrong. Try reloading the page");
        }
        return;
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

  hasEditBranch() {
    if (!this.branch || ["master", ""].includes(this.branch)) {
      return false;
    }
    return true;
  }

  setMode() {
    if (this.hasEditBranch()) {
      this.mode = "write";
    }
  }

  async createBranch(newBranchName: string) {
    const token = localStorage.getItem("token") || "";
    const masterHash = await RepoBranchService.getReferenceBranchHash(
      token,
      "vulnerabilities",
      "master"
    )
      .then(async response => {
        return response.data.object.sha;
      })
      .catch(err => {
        if (err.response.status == 401) {
          this.$toast.error("Could not authenticate");
          this.$router.push({ name: "login" });
        } else {
          this.$toast.error("Something went wrong. Please try again");
        }
        return;
      });

    await RepoBranchService.create(
      token,
      "vulnerabilities",
      newBranchName,
      masterHash
    )
      .then(async response => {
        return response.data;
      })
      .catch(err => {
        if (err.response.status == 401) {
          this.$toast.error("Could not authenticate");
        } else {
          this.$toast.error("Something went wrong. Please try again");
        }
        return;
      });

    this.$store.commit("saveBranch", newBranchName);
    localStorage.setItem("branch", newBranchName);
    return;
  }

  async startWrite() {
    this.getBranch();
    this.setMode();

    if (this.hasEditBranch()) {
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1.1rem;
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

.modal-body {
  padding: 0.8rem 1.15rem 1rem;
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
    margin-left: 0.7rem;
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
  &__notice {
    color: lighten($color-gray, 20%);
    padding-top: 1rem;
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

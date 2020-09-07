<template>
  <footer class="footer">
    <div v-if="mode === 'read'" class="vuln-read-options">
      <button class="akt-btn akt-btn--primary" v-on:click="startWrite()">
        Start Translation
      </button>
      <!-- <button class="akt-btn akt-btn--secondary">Edit Vulnerabilities</button> -->
    </div>
    <div v-if="mode === 'write'" class="vuln-read-options">
      <button class="akt-btn akt-btn--primary">Commit Changes</button>
      <button class="akt-btn akt-btn--secondary">Submit for Review</button>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RepoBranchService from "@/services/RepoBranchService";
import GithubRepoBranchResponse from "@/types/github/GithubRepoBranchResponse";
// import GithubReferenceResponse from "@/types/github/GithubReferenceResponse";

@Component
export default class FooterBar extends Vue {
  private branch = "master";
  private mode = "read";
  private username = localStorage.getItem("username");

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
</style>

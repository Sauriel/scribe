<script lang="ts">
import { Vue, Options, Watch } from "vue-property-decorator";
import emitter from "@/emitter";
import { NotificationType, NotificationUpdateEvent, NOTIFICATION_UPDATE_EVENT_NAME } from "@/events/notification";
import ApolloService, { APOLLO_SERVICE } from "@/services/ApolloService";
import docFindAllSchema from "@/graphql/document/doc_findAll.gql";
import { DocFindAllQuery, Document as GQLDocument, FindAllDocumentsInput } from "@/graphql/document/models";
import { SelectBarEntry } from "@/components/app/ui/select-bar/SelectBar.vue";
import VuexHelper from "@/helper/VuexHelper";
import { DOCUMENT_STORE_NAMESPACE } from "@/store/document/documentStoreModule";
import { ROUTE_NAMES } from "@/router";
import StringHelper from "@/helper/StringHelper";

const KB_MB_DIVIDE = 512 * 1024; // 0.5 MB

const documentStore = VuexHelper.createNamespace(DOCUMENT_STORE_NAMESPACE);

@Options({
  inject: [ APOLLO_SERVICE ]
})
export default class Library extends Vue {

  private get apollo(): ApolloService {
    // @ts-ignore
    return this.apolloService;
  }

  private documents: GQLDocument[] = [];
  private maxDocuments = 0;
  private currentPage = 1;
  private pageSize = 12;

  private bookshelf = false;

  private views: SelectBarEntry<boolean>[] =[
    { icon: "grip-horizontal", data: false },
    { icon: "book", data: true }
  ];

  private get maxPage(): number {
    return Math.ceil(this.maxDocuments / this.pageSize);
  }

  private fileSize(byte: number): string {
    if (byte < KB_MB_DIVIDE) {
      return this.$t("global.file-size.kb", { size: this.toKB(byte) });
    } else {
      return this.$t("global.file-size.mb", { size: this.toMB(byte) });
    }
  }

  private toKB(byte: number): number {
    return Math.floor(byte / 1024 * 100) / 100;
  }


  private toMB(byte: number): number {
    return Math.floor(byte / 1024 / 1024 * 100) / 100;
  }

  @Watch("currentPage")
  private onCurentPageChanged() {
    this.getServerSaves();
  }

  mounted() {
    this.getServerSaves();
  }

  private getServerSaves() {
    const input: FindAllDocumentsInput = {
      paging: {
        page: this.currentPage,
        limit: this.pageSize
      }
    };
    this.apollo
      .query<DocFindAllQuery>(docFindAllSchema, { input }, true)
      .then(data => {
        this.documents = data.doc_findAll.documents;
        this.maxDocuments = data.doc_findAll.documentCount;
      })
      .catch(e => {
        const firstError = e[0] || null;
        let messageKey = firstError?.extensions?.messageKey || "error.unknown";
        this.showMessage(messageKey, "failure");
      });
  }

  private openDocument(document: GQLDocument) {
    const name = StringHelper.normalizeForURI(document.name);
    const user = StringHelper.normalizeForURI(document.user.username)
    this.$router.push({ name: ROUTE_NAMES.view, params: { name: name, user: user }, query: { id: document.id } });
  }

  private showMessage(messageKey: string, type: NotificationType) {
    const event: NotificationUpdateEvent = {
      name: NOTIFICATION_UPDATE_EVENT_NAME,
      payload: {
        type: type,
        content: this.$t(messageKey),
        visible: true,
      },
    };
    emitter.$emit(NOTIFICATION_UPDATE_EVENT_NAME, event);
  }
}
</script>

<template src="@/views/library/library.template.html" />
<style src="@/views/library/library.style.scss" lang="scss" scoped />
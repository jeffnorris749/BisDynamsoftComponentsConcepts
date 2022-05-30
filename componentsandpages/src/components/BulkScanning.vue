<template>
  <div>
    <v-dialog v-model="clearAllDialogIsShown" max-width="30%" persistent>
      <v-card>
        <h2 style="text-align: center">Are you sure?</h2>
        <v-card-text class="actionsClear">
          <span v-if="!filterTag">
            This Will Clear All Currently Scanned Images
          </span>
          <span v-else> This Will Clear All Images For This Transaction </span>
        </v-card-text>
        <v-card-actions class="actionsClear">
          <v-btn
            color="red"
            @click="
              clearAllDialogIsShown = false;
              DWObject.Viewer.show();
            "
          >
            <span class="white-text">Cancel</span>
          </v-btn>
          <v-btn
            raised
            color="green"
            @click="
              DWObject.Viewer.show();
              clearAllDocuments();
            "
          >
            <span class="white-text">Clear</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="80vw" v-model="errorTable" persistent>
      <v-card>
        <v-card-text>
          <v-data-table :headers="errorTableFields" :items="scannedRecords">
          </v-data-table>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            @click="
              errorTable = false;
              DWObject.Viewer.show();
            "
            color="primary"
            >Okay</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="600" v-model="showModal" persistent>
      <v-card>
        <div class="closeModalButtonRight">
          <v-btn
            @click="
              showModal = false;
              DWObject.Viewer.show();
            "
            icon
          >
            <v-icon color = "red">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="mainModal pa-2">
          <v-switch v-model="showUI" label="Show Options on Scan"></v-switch>
          <v-switch v-model="duplex" label="Duplex">Duplex</v-switch>
          <v-select v-model="dpi" :items="dpiItems" />
          <v-text-field
            label="Blank Page Sensitivity"
            type="number"
            v-model="blankPageSensitivity"
          />
          <v-slider v-model="blankPageSensitivity" hide-details />
        </div>
      </v-card>
    </v-dialog>
    <v-dialog width="20vw" v-model="showNoScannerDialog" persistent>
      <v-card>
        <v-card-title class="d-flex justify-center">
          No Scanner Found!
        </v-card-title>
        <v-card-text class="d-flex flex-column align-center">
          <div>Please Ensure Your Scanner is On and Retry</div>
          <div v-if="DWObject.HowManyImagesInBuffer > 0">
            THIS WILL REMOVE ANY UNSAVED WORK
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="green" @click="retryScan"> Retry </v-btn>
          <v-btn
            color="error"
            @click="
              showNoScannerDialog = false;
              DWObject.Viewer.show();
              retry = false;
            "
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-row>
      <div class="ml-3 mt-4">
        <v-btn
          class="mr-1"
          color="primary"
          @click="acquireImage"
          :disabled="isScanning"
        >
          <span v-if="this.scannedRecords.length > 0"> Add Images </span>
          <span v-else> Start Scanning </span>
        </v-btn>
        <v-btn
          class="mr-1"
          color="primary"
          @click="changeScanner"
          :disabled="isScanning"
          >Change Scanner</v-btn
        >
        <v-btn
          class="mr-1"
          color="primary"
          @click="
            showModal = true;
            DWObject.Viewer.hide();
          "
          :disabled="isScanning"
          >Scan Options</v-btn
        >
        <v-tooltip
          bottom
          :disabled="
            scannedRecords.length > 0 &&
            !Object.prototype.hasOwnProperty.call(transactions,'NO MATCH') &&
            !Object.prototype.hasOwnProperty.call(transactions,'TNClerk')
          "
        >
          <template v-slot:activator="{ on }">
            <span v-on="on">
              <v-btn
                class="ma-1"
                color="green"
                @click="saveDocuments"
                :disabled="
                  isScanning ||
                  !(scannedRecords.length > 0) ||
                  Object.prototype.hasOwnProperty.call(transactions,'NO MATCH') ||
                  Object.prototype.hasOwnProperty.call(transactions,'TNClerk')
                "
              >
                <span class="white-text">Save Documents</span>
              </v-btn>
            </span>
          </template>
          <span v-if="this.scannedRecords.length === 0">
            Images Must Be Scanned Before Submitting
          </span>
          <span v-else-if="Object.prototype.hasOwnProperty.call(transactions,'NO MATCH')">
            You Have Images Without a Transaction
          </span>
          <span v-else-if="Object.prototype.hasOwnProperty.call(transactions,'TNClerk')">
            You Have Images That Should Be Scanned In TNClerk
          </span>
        </v-tooltip>
      </div>
      <v-spacer />
      <v-btn
        @click="showImagesInTransaction('')"
        :style="filterTag ? '' : 'visibility:hidden;'"
        small
        class="mr-3"
        color="red"
      >
        Clear Selection
      </v-btn>
    </v-row>
    <v-row>
      <v-col id="previewer">
        <v-card
          id="docPreview"
          elevation="5"
          class="d-flex flex-column"
          height="80vh"
        >
          <v-card-title>
            <h2>
              {{ documentPreviewTitle }}
            </h2>
          </v-card-title>
          <v-card-text
            style="flex-grow: 1; overflow: hidden"
            class="d-flex flex-column"
          >
            <div id="controls">
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="imageZoomIn"
                :disabled="isScanning"
              >
                <span class="white-text">Zoom +</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="imageZoomOut"
                :disabled="isScanning"
              >
                <span class="white-text">Zoom -</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="DWObject.Viewer.fitWindow()"
                :disabled="isScanning"
              >
                <span class="white-text">Fit to Screen</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="deleteSelected"
                :disabled="isScanning"
              >
                <span class="white-text">Delete</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="printImage(false)"
                :disabled="isScanning"
              >
                <span class="white-text">Print</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="saveImageLocally(false)"
                :disabled="isScanning"
              >
                <span class="white-text">Download</span>
              </v-btn>
              <v-tooltip
                bottom
                :disabled="
                  filterTag === 'NO MATCH' ||
                  filterTag === 'TNClerk' ||
                  (![undefined, null, ''].includes(filterTag) &&
                    !is201(filteredIndex))
                "
              >
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-btn
                      class="mb-1"
                      color="blue"
                      small
                      @click="transferToDiffTransID"
                      :disabled="
                        isScanning ||
                        [undefined, null, ''].includes(filterTag) ||
                        (is201(filteredIndex) &&
                          filterTag !== 'NO MATCH' &&
                          filterTag !== 'TNClerk')
                      "
                    >
                      <span class="white-text">Transfer Document</span>
                    </v-btn>
                  </span>
                </template>
                <span>
                  {{ noTransferMessage }}
                </span>
              </v-tooltip>
            </div>
            <div id="dwtcontrolContainer" style="flex-grow: 1"></div>
            <div id="controls">
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer)"
                :disabled="isScanning"
              >
                <span class="white-text">Rotate Left</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="
                  DWObject.RotateRight(DWObject.CurrentImageIndexInBuffer)
                "
                :disabled="isScanning"
              >
                <span class="white-text">Rotate Right</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="
                  DWObject.Crop(
                    DWObject.CurrentImageIndexInBuffer,
                    leftVertex,
                    topVertex,
                    rightVertex,
                    bottomVertex
                  )
                "
                :disabled="isScanning"
              >
                <span class="white-text">Crop Area</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="
                  DWObject.Erase(
                    DWObject.CurrentImageIndexInBuffer,
                    leftVertex,
                    topVertex,
                    rightVertex,
                    bottomVertex
                  )
                "
                :disabled="isScanning"
              >
                <span class="white-text">Erase Area</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="
                  clearAllDialogIsShown = true;
                  DWObject.Viewer.hide();
                "
                :disabled="isScanning"
              >
                <span class="white-text">Delete All</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="printImage(true)"
                :disabled="isScanning"
              >
                <span class="white-text">Print All</span>
              </v-btn>
              <v-btn
                class="mb-1"
                color="blue"
                small
                @click="saveImageLocally(true)"
                :disabled="isScanning"
              >
                <span class="white-text">Download All</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <div class="legend">
          <div>
            <div class="color" style="background-color: #b8daff"></div>
            <span> - Selected</span>
          </div>
          <div>
            <div class="color" style="background-color: #ffd9d9"></div>
            <span> - Error</span>
          </div>
          <div>
            <div class="color" style="background-color: #fff9bf"></div>
            <span> - Error Selected</span>
          </div>
        </div>
        <div class="bootstrap">
          <b-table
            sticky-header="75vh"
            :no-border-collapse="true"
            hover
            focusable
            bordered
            outlined
            :show-empty="true"
            :fields="tableFields"
            head-variant="dark"
            sort-icon-left
            :items="scannedRecords"
            @row-clicked="showImagesInTransaction"
            @row-hovered="handleErrorRow(true, $event)"
            @row-unhovered="handleErrorRow(false, $event)"
          >
            <template #row-details="row">
              {{ row.item.error }}
            </template>
            <template v-slot:cell(transactionType)="data">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ data.item.transactionType }}</span>
                </template>
                <span>{{ transactionTypes[data.item.transactionType] }}</span>
              </v-tooltip>
            </template>
            <template v-slot:cell(imageIds)="data">
              <div>
                {{ data.item.images.length }}
              </div>
            </template>
          </b-table>
        </div>
      </v-col>
    </v-row>
    <v-snackbar bottom v-model="allowTransfer" color="primary">
      {{ transferSnackMessage }}
      <v-btn outlined @click="allowTransfer = false">Cancel</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
//All plate transaction types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const transactionTypes = require("@/assets/jsonScaffolds/transactionTypes.json");
import Dynamsoft from "dwt";
import swal from "sweetalert2";
import $ from "jquery";
import dayjs from "dayjs";


export default {
  name: "ScanningComponents",
  data() {
    return {
      documentPreviewTitle: "Document Preview",
      singleView: false,
      clearAllDialogIsShown: false,
      dpiItems: [
        { value: 100, text: "100 DPI" },
        { value: 300, text: "300 DPI" },
        { value: 600, text: "600 DPI" }
      ],
      dpi: 300,
      leftVertex: 0,
      rightVertex: 0,
      topVertex: 0,
      bottomVertex: 0,
      showModal: false,
      // apiURL: this.$store.getters.apiUrl retreive for tncounty-clerk
      allowTransfer: false,
      transactions: {},
      tableFields: [
        { key: "vin", label: "VIN" },
        { key: "transactionType", label: "Type" },
        { key: "imageIds", label: "Pages" }
      ],
      errorTableFields: [
        { value: "vin", text: "VIN", align: "center" },
        { value: "transactionType", text: "Type", align: "center" },
        { value: "error", text: "Error", align: "center" }
      ],
      DWObject: {},
      blankPageSensitivity: 2,
      f: 300,
      showUI: false,
      thumbnailViewer: {},
      duplex: true,
      pixelType: 0,
      numImages: 0,
      transactionTypes,
      scannedRecords: [],
      filterTag: null,
      errorTable: false,
      transferSnackMessage: "",
      currentTransID: null,
      isScanning: false,
      filteredIndex: -1,
      noTransferMessage:
        "You Must First Select A Scanned VIN From The Table To Transfer From",
      selectedRow: null,
      selectedIndex: null,
      imageIDsToReadBarcode: [],
      processing: false,
      showNoScannerDialog: false,
      retry: false
    };
  },
  methods: {
    showImagesInTransaction(row, index) {
      if (!this.allowTransfer) {
        if (
          !["", null, undefined].includes(index) &&
          this.selectedIndex === index
        ) {
          this.showImagesInTransaction("");
          return;
        }

        this.selectedRow = row;
        this.selectedIndex = index;
        this.filteredIndex = 0;
        this.scannedRecords.forEach(record => {
          record._rowVariant = "";
          if (record.error) {
            record._rowVariant = "danger";
          }
        });
        if (row) {
          this.scannedRecords[index]._rowVariant = "primary";
          if (this.scannedRecords[index].error) {
            this.scannedRecords[index]._rowVariant = "warning";
          }
          this.documentPreviewTitle = "Documents For VIN: " + row.vin;
          this.noTransferMessage =
            "Cannot Transfer 201 Scans. Only Non 201 Forms Can Be Transfered";
          this.filterTag = row.transID;
        } else {
          this.documentPreviewTitle = "All Image Documents";
          this.noTransferMessage =
            "You Must First Select A Scanned VIN From The Table To Transfer From";
          this.filterTag = "";
        }
        this.currentTransID = this.filterTag;
        this.DWObject.ClearFilter(); //Reset Filter
        this.DWObject.FilterImagesByTag(this.filterTag); //Filter image by transID
        this.DWObject.CurrentImageIndexInBuffer = 0;
        this.DWObject.Viewer.show();
      } else {
        this.selectTransfer(row);
      }
      this.DWObject.Viewer.render();
    },
    saveImageLocally(saveAll) {
      this.DWObject.IfShowFileDialog = true;
      this.DWObject.ClearFilter();
      let fileString = dayjs().format("MM-DD-YYYY") + "_";
      if (this.filterTag) {
        fileString += this.filterTag;
        this.DWObject.FilterImagesByTag(this.filterTag);
      }
      if (saveAll) {
        this.DWObject.SaveAllAsPDF(fileString + ".pdf");
      } else {
        this.DWObject.SaveAsPDF(
          fileString + ".pdf",
          this.DWObject.CurrentImageIndexInBuffer
        );
      }
    },
    async saveDocuments() {
      const sendUrl = this.apiURL + "/tandr/documents";

      if (Object.prototype.hasOwnProperty.call(this.transactions,"NO MATCH")) {
        swal.fire(
          "Error!",
          "You have images that are not attached to a transaction. Please move these images to a transaction or delete them.",
          "error"
        );
      } else {
        $("#loadingWrapper").fadeIn();
        await Promise.all(
          this.scannedRecords.map(async transactionObject => {
            const dataToSend = {};
            // Creates an array for length filled with indexs
            const indexArr = Array.from(
              Array(transactionObject.images.length).keys()
            );
            this.DWObject.FilterImagesByTag(transactionObject.transID);
            const document = await this.getTiffString(indexArr);

            Object.assign(dataToSend, {
              transactionID: parseInt(transactionObject.transID),
              document,
              append: true
            });

            try {
              await fetch(
                sendUrl,
                {
                  method: "POST",
                  body: JSON.stringify(dataToSend)
                },
                {
                  404: async res => {
                    const error = await res.json();
                    throw error;
                  },
                  500: async res => {
                    const error = await res.json();
                    throw error;
                  }
                }
              );
              this.clearAllDocuments(transactionObject.transID);
            } catch (error) {
              if (error.err) {
                this.transactions[transactionObject.transID].error = error.err;
              } else {
                this.transactions[transactionObject.transID].error =
                  "An Unknown Error Occurred";
              }
            }
          })
        );
        if (Object.keys(this.transactions).length > 0) {
          this.errorTable = true;
          this.showImagesInTransaction("");
          this.DWObject.Viewer.hide();
        } else {
          this.filterTag = "";
        }
        this.$forceUpdate();
      }
      $("#loadingWrapper").fadeOut();
    },
    async printImage(printAll) {
      let indexArr = [];
      if (printAll) {
        for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++) {
          indexArr.push(i);
        }
      } else {
        indexArr = [this.DWObject.CurrentImageIndexInBuffer];
      }
      this.DWObject.ConvertToBase64(
        indexArr,
        Dynamsoft.DWT.EnumDWT_ImageType.IT_PDF,
        function (base64Result) {
          let pdfString = base64Result.getData(0, base64Result.getLength());
          $.ajax({
            method: "POST",
            url: "http://127.0.0.1:8085/printBase64PDF",
            dataType: "json",
            async: false,
            data: {
              send: JSON.stringify({
                pdf: pdfString,
                index: 0
              })
            }
          }).fail(function (jqXHR, status, err) {
            swal.fire(
              "Error!",
              "The STAR Hub app is not running! Please download it from the login page and start it!",
              "error"
            );
          });
        },
        function (errorCode, errorString) {
          swal.fire("Error", "Could not print!", "error");
        }
      );
    },
    async transferToDiffTransID() {
      this.allowTransfer = true;
      this.transferSnackMessage = "Select Which Transaction To Transfer To";
    },
    deleteSelected() {
      let selectedImages = this.DWObject.SelectedImagesIndices;
      if (
        ["NO MATCH", "TNClerk"].includes(this.filterTag) ||
        !selectedImages.some(this.is201)
      ) {
        this.DWObject.RemoveAllSelectedImages();
        this.updateTransactions();
        return;
      }
      if ([null, undefined, ""].includes(this.filterTag)) {
        selectedImages = selectedImages.filter(index => !this.is201(index));
        this.snack({
          color: "warning",
          text: "Cannot Delete 201 Scans Unless Filtered",
          position: "bottom"
        });
      } else {
        selectedImages = selectedImages.filter(index => index !== 0);
        this.snack({
          color: "warning",
          text: "Deleted All Selected Other Than Inital 201 Scan",
          position: "bottom"
        });
      }
      this.DWObject.SelectImages(selectedImages);
      this.DWObject.RemoveAllSelectedImages();
      this.updateTransactions();
    },
    clearAllDocuments(filter = "") {
      if (filter) {
        this.DWObject.FilterImagesByTag(filter);
      }
      this.DWObject.RemoveAllImages();
      this.DWObject.ClearFilter();
      this.filterTag = null;
      this.numImages = this.DWObject.HowManyImagesInBuffer;
      this.clearAllDialogIsShown = false;
      this.documentPreviewTitle = "Document Preview";
      this.updateTransactions();
    },
    imageZoomIn() {
      this.singleView = true;
      this.DWObject.Viewer.singlePageMode = true;
      this.DWObject.Viewer.zoom += 0.05;
    },
    imageZoomOut() {
      this.singleView = true;
      this.DWObject.Viewer.singlePageMode = true;
      this.DWObject.Viewer.zoom -= 0.05;
    },
    changeScanner() {
      this.DWObject.SelectSource(
        () => {
          this.DWObject.CloseSource();
          this.DWObject.OpenSource();
        },
        (errorCode, errorString) => {
          console.error({ errorCode, errorString });
          if (errorCode === 0) return; // User cancelled selection
          swal.fire("Error!", "SelectSource failed!", "error");
        }
      );
    },
    async acquireImage() {
      this.currentTransID = this.filterTag;
      this.isScanning = true;
      if (this.DWObject) {
        this.DWObject.CloseSource();
        this.DWObject.OpenSource();
        await this.DWObject.AcquireImage(
          {
            IfShowUI: this.showUI,
            Resolution: this.dpi,
            IfDuplexEnabled: this.duplex,
            PixelType: this.pixelType,
            IfDisableSourceAfterAcquire: true,
            IfAutomaticDeskew: true,
            PixelFlavor: 1,
            PageSize: Dynamsoft.DWT.EnumDWT_CapSupportedSizes.TWSS_MAXSIZE
          },
          () => {
            this.isScanning = false;
            this.DWObject.RemoveTag("scanned");
          },
          (settings, errCode, errString) => {
            console.error({ errCode, errString });
            this.isScanning = false;
            if (errCode === -1032) {
              // User Cancelled Scan
              swal.fire("Warning!", errString, "error");
            } else if (errCode === -1003) {
              //No scanners found
              this.retry = true;
              this.showNoScannerDialog = true;
              this.$nextTick(() => {
                this.DWObject.Viewer.hide();
              });
            } else {
              swal.fire("Error!", errString, "error");
            }
            this.clearAllDocuments("scanned");
            this.showImagesInTransaction(this.selectedRow, this.selectedIndex);
            this.DWObject.CloseSource();
          }
        );
      }
    },
    async readBarcode(imageID) {
      this.DWObject.TagImages(
        [this.DWObject.ImageIDToIndex(imageID)],
        "scanned"
      );
      this.filteredIndex = this.DWObject.CurrentImageIndexInBuffer;
      const results = await this.DWObject.Addon.BarcodeReader.decode(
        this.DWObject.ImageIDToIndex(imageID)
      );
      let barcodeData = undefined;
      if (results.length > 0) {
        for (let i = 0; i < results.length; i++) {
          barcodeData = this.getBarcodeData(results[i].barcodeText);
          if (barcodeData !== undefined) break;
        }
      }
      if (barcodeData?.type === "STAR") {
        this.DWObject.TagImages([this.DWObject.ImageIDToIndex(imageID)], "201");
        this.currentTransID = barcodeData.data.STARTransactionID;
        this.transactions[this.currentTransID] = {
          vin: barcodeData.data.vin,
          transID: barcodeData.data.STARTransactionID,
          transactionType: barcodeData.data.transactionType,
          timestamp: barcodeData.data.timestamp,
          _showDetails: false
        };
      } else if (barcodeData?.type === "TNClerk") {
        this.currentTransID = "TNClerk";
      }
      if (this.currentTransID !== null) {
        this.DWObject.TagImages(
          [this.DWObject.ImageIDToIndex(imageID)],
          this.currentTransID
        );
        if (this.filterTag && this.filterTag !== this.currentTransID) {
          this.DWObject.RemoveTag(this.filterTag, [
            this.DWObject.ImageIDToIndex(imageID)
          ]);
        }
      } else {
        this.DWObject.TagImages(
          [this.DWObject.ImageIDToIndex(imageID)],
          "NO MATCH"
        );
      }
      this.numImages = this.DWObject.HowManyImagesInBuffer;
      this.updateTransactions();
    },
    async getTiffString(imageIndex) {
      this.DWObject.TIFFCompressionType = 4; //sets compression to ccitt

      return new Promise((resolve, reject) => {
        this.DWObject.ConvertToBase64(
          imageIndex,
          Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF,
          function (base64Result) {
            resolve(base64Result.getData(0, base64Result.getLength()));
          },
          function (errorCode, errorString) {
            console.error(errorString);
            $("#loadingWrapper").fadeOut();
            reject(errorCode);
          }
        );
      });
    },
    onReady() {
      this.DWObject = Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer");
      this.DWObject.IfUseTwainDSM = true; // Remove the option for WIA drivers
      this.DWObject.Viewer.width = "100%";
      this.DWObject.Viewer.height = "100%";
      this.DWObject.Viewer.background = "rgba(0, 0, 0, 0.35)";
      this.DWObject.Viewer.singlePageMode = true;
      this.thumbnailViewer = this.DWObject.Viewer.createThumbnailViewer({
        size: "30%",
        rows: 3,
        columns: 2,
        location: "left"
      });

      this.thumbnailViewer.on("click", event => {
        this.filteredIndex = event.index;
      });

      this.thumbnailViewer.show();

      this.DWObject.Viewer.on("pageAreaSelected", (sImageIndex, rect) => {
        this.leftVertex = rect[0].x;
        this.rightVertex = rect[0].x + rect[0].width;
        this.topVertex = rect[0].y;
        this.bottomVertex = rect[0].y + rect[0].height;
      });

      this.DWObject.RegisterEvent("OnPostTransferAsync", ({ imageId }) => {
        this.imageIDsToReadBarcode.push(imageId);
        if (!this.processing) {
          this.processing = true;
          this.processImages();
        }
      });

      this.DWObject.RegisterEvent("OnPostAllTransfers", () => {
        this.DWObject.CloseSource();
        this.processing = false;
      });

      // Set Dynamsoft to only look for PDF417 barcodes
      this.DWObject.Addon.BarcodeReader.getRuntimeSettings().then(
        runtimeSettings => {
          runtimeSettings.barcodeFormatIds =
            Dynamsoft.DBR.EnumBarcodeFormat.BF_PDF417;
          return this.DWObject.Addon.BarcodeReader.updateRuntimeSettings(
            runtimeSettings
          );
        },
        error => {
          console.error(error);
        }
      );

      if (this.retry === true) {
        // Already warned user about no scanner
        this.acquireImage();
        return;
      }

      if (this.DWObject.GetSourceNames().length === 0) {
        //No scanners found
        this.DWObject.Viewer.hide();
        this.showNoScannerDialog = true;
      }
    },
    getBarcodeData(data) {
      const starRegex = /^(?<version>\d+)\|(?<vin>[A-Z,0-9]{17})\|(?<STARTransactionID>\d{10})\|(?<transactionType>[A-Z]{2,})\|(?<timestamp>\d\d:\d\d)$/; //tags for STARS records
      const tnClerkRegex = /^(?<county>\d{3})(?<transactionType>(N\d)|(\d{2}))(?<title>\d{8,11})MVD(?<tnClerkTransactionID>\d{10})$/; //tags for TN County Clerk records
      if (starRegex.exec(data)?.groups) {
        return {
          type: "STAR",
          data: starRegex.exec(data)?.groups
        };
      } else if (tnClerkRegex.exec(data)?.groups) {
        return {
          type: "TNClerk",
          data: tnClerkRegex.exec(data)?.groups
        };
      }
      return undefined;
    },
    updateTransactions() {
      const tags = this.DWObject.GetTagList();
      if (!Object.prototype.hasOwnProperty.call(this.transactions,"NO MATCH")) {
        this.transactions["NO MATCH"] = {
          vin: "NO MATCH",
          transID: "NO MATCH",
          timestamp: "00:00"
        };
      }
      if (!Object.prototype.hasOwnProperty.call(this.transactions,"TNClerk")) {
        this.transactions["TNClerk"] = {
          vin: "TNClerk",
          transID: "TNClerk",
          timestamp: "00:01"
        };
      }
      tags.forEach(tag => {
        if (tag.name === "scanned" || tag.name === "201") return;
        this.transactions[tag.name].images = tag.imageIds;
      });
      Object.keys(this.transactions).forEach(key => {
        if (
          this.transactions[key].images == undefined ||
          this.transactions[key].images.length === 0
        ) {
          if (this.filterTag === key) {
            this.showImagesInTransaction("");
          }
          delete this.transactions[key];
          this.DWObject.RemoveTag(key);
        }
      });
      this.scannedRecords = Object.values(this.transactions).sort((a, b) => {
        const aTime = a.timestamp.replace(":", "");
        const bTime = b.timestamp.replace(":", "");
        return aTime - bTime;
      });
      this.$forceUpdate();
    },
    async selectTransfer(data) {
      if (!this.allowTransfer) return;
      if (this.filterTag === data.transID) {
        this.snack({
          color: "error",
          text: "Cannot Transfer To The Same Transaction",
          position: "bottom"
        });
        this.allowTransfer = false;
        return;
      }
      let selectedImages = this.DWObject.SelectedImagesIndices;
      if (
        this.filterTag !== "NO MATCH" &&
        this.filterTag !== "TNClerk" &&
        selectedImages.some(index => this.is201(index))
      ) {
        selectedImages = selectedImages.filter(index => !this.is201(index));
        this.snack({
          color: "warning",
          text: "Cannot Transfer 201 Scans",
          position: "bottom"
        });
      }
      selectedImages = selectedImages.sort((a, b) => {
        return a - b;
      });
      this.DWObject.TagImages(selectedImages, data.transID);
      this.DWObject.RemoveTag(this.filterTag, selectedImages);
      this.allowTransfer = false;
      if (this.DWObject.HowManyImagesInBuffer === 0) {
        this.showImagesInTransaction("");
      }
      this.filteredIndex = this.DWObject.CurrentImageIndexInBuffer;
      this.updateTransactions();
    },
    handleErrorRow(showDetails, row) {
      if (row.error) {
        row._showDetails = showDetails;
      }
    },
    async processImages() {
      while (this.processing || this.imageIDsToReadBarcode.length > 0) {
        if (this.imageIDsToReadBarcode.length > 0) {
          for (const imageID of this.imageIDsToReadBarcode.splice(0)) {
            await this.readBarcode(imageID);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    },
    retryScan() {
      this.showNoScannerDialog = false;
      Dynamsoft.DWT.Unload();
      Dynamsoft.DWT.Load();
    },
    is201(index) {
      const tags = this.DWObject.GetTagList();
      const tagged201s = tags.filter(tag => tag.name === "201")[0].imageIds;
      const imageID = this.DWObject.IndexToImageID(index);
      return tagged201s.includes(imageID);
    }
  },
  async mounted() {
    Dynamsoft.DWT.Load();
    Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", this.onReady);
  },
  async beforeRouteLeave(to, from, next) {
    if (this.scannedRecords.length > 0) {
      swal
        .fire({
          title: "Are You Sure?",
          text:
            "You Have Unsaved Transactions. Are You Sure You Want To Leave?",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(response => {
          if (response.isConfirmed) {
            next();
          }
        });
    } else {
      next();
    }
  }
};
</script>
<style scoped>
#dwtcontrolContainer {
  height: 80%;
  overflow: hidden;
}
.actionsClear {
  display: flex;
  justify-content: center;
}
.mainModal {
  max-width: 100%;
  max-height: 100%;
  text-align: center;
}
#docPreview {
  max-height: 100%;
  max-width: 100%;
  padding-bottom: 10px;
}
.closeModalButtonRight {
  float: right;
}
#previewer {
  min-width: 70vw;
}
#controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 3px;
}
#controls .v-btn{
  margin-left: 5px;
}
.scannedRecords {
  max-height: 80vh;
}
.legend {
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
}
.legend > div {
  display: flex;
}
.color {
  min-width: 20px;
  min-height: 20px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>

<template>
  <div class="mainDiv">
    <v-dialog width="500" v-model="showModal">
      <v-card>
        <v-card-text>
          <div class="closeModalButtonRight">
            <v-btn
              @click="
                showModal = false;
                DWObject.Viewer.show();
              "
              icon
            >
              <v-icon color="red">close</v-icon>
            </v-btn>
          </div>
          <div class="mainModal">
            <v-switch v-model="showUI" label="Show Options on Scan"></v-switch>

            <v-switch v-model="duplex" label="Duplex">Duplex</v-switch>

            <v-select
              v-model="dpi"
              :items="[
                { value: 100, text: '100 DPI' },
                { value: 300, text: '300 DPI' },
                { value: 600, text: '600 DPI' }
              ]"
            />

            <v-text-field
              label="Blank Page Sensitivity"
              type="number"
              v-model="blankPageSensitivity"
            />
            <v-slider v-model="blankPageSensitivity" hide-details />
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            @click="
              showModal = false;
              DWObject.Viewer.show();
            "
          >
            <span>Close</span>
          </v-btn>
        </v-card-actions>
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

    <div v-if="showScanControls" id="topOptions">
      <v-btn @click="AcquireImage">Scan</v-btn>

      <v-btn @click="selectSource">Change Scanner</v-btn>

      <v-btn
        @click="
          showModal = true;
          DWObject.Viewer.hide();
        "
        >Scan Options</v-btn
      >

      <v-btn @click="uploadLocalFile">Upload File</v-btn>
    </div>

    <div class="imgContain">
      <div class="mt-2" id="controls">
        <v-btn class="mb-1" color="blue" small @click="DWObject.next()">
          <span class="white-text">Next</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="DWObject.previous()">
          <span class="white-text">Prev</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="DWObject.Viewer.zoom += 0.05"
        >
          <span class="white-text">Zoom +</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="DWObject.Viewer.zoom -= 0.05"
        >
          <span class="white-text">Zoom -</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="DWObject.Viewer.fitWindow()"
        >
          <span class="white-text">Fit to Screen</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="DWObject.RotateLeft(DWObject.CurrentImageIndexInBuffer)"
        >
          <span class="white-text">Rotate Left</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="DWObject.RotateRight(DWObject.CurrentImageIndexInBuffer)"
        >
          <span class="white-text">Rotate Right</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="darken">
          <span class="white-text">Darken</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="lighten">
          <span class="white-text">Lighten</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="deskew">
          <span class="white-text">Deskew</span>
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
        >
          <span class="white-text">Crop Selected</span>
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
        >
          <span class="white-text">Erase Selected</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="deleteSelected">
          <span class="white-text">Delete Selected</span>
        </v-btn>
        <v-btn
          class="mb-1"
          color="blue"
          small
          @click="
            deleteAllPages();
            showImagesEdit = false;
          "
        >
          <span class="white-text">Delete All Pages</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="printImage(false)">
          <span class="white-text">Print Current</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="printImage(true)">
          <span class="white-text">Print All</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="saveImageLocally(false)">
          <span class="white-text">Download Current</span>
        </v-btn>
        <v-btn class="mb-1" color="blue" small @click="saveImageLocally(true)">
          <span class="white-text">Download All</span>
        </v-btn>
      </div>
      <div id="dwtcontrolContainer"></div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import swal from "sweetalert2";
import Dynamsoft from "dwt";

export default {
  name: "ImageScanner",
  props: {
    existingImage: String,
    transactionNumber: { type: String, default: "scannedImage" },
    showScanControls: { type: Boolean, default: true }
  },
  data() {
    return {
      leftVertex: 0,
      rightVertex: 0,
      topVertex: 0,
      bottomVertex: 0,
      showModal: false,
      DWObject: {},
      thumbnailViewer: {},
      blankPageSensitivity: 2,
      dpi: 300,
      showUI: false,
      duplex: true,
      pixelType: 0,
      brightness: 0,
      showNoScannerDialog: false,
      retry: false
    };
  },
  mounted() {
    $("#loadingWrapper").fadeOut();
    if (
      this.$route.name === "Documentation" &&
      !this.officeConfig.scanDocumentationAfterTransaction
    ) {
      return;
    }
    Dynamsoft.DWT.Load();
    Dynamsoft.DWT.RegisterEvent("OnWebTwainReady", this.onReady);
  },
  methods: {
    uploadLocalFile() {
      this.DWObject.IfShowFileDialog = true;
      this.DWObject.LoadImageEx("", Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL);
      this.DWObject.ConvertToBW(this.DWObject.CurrentImageIndexInBuffer);
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
        base64Result => {
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
          })
            .done(msg => {
              //
            })
        },
        function (errorCode, errorString) {
          console.error(errorString);
          console.error(errorCode);
          swal.fire("Error", "Could not print!", "error");
        }
      );
    },
    saveImageLocally(saveAll) {
      this.DWObject.IfShowFileDialog = true;
      if (saveAll) {
        this.DWObject.SaveAllAsPDF(this.transactionNumber + ".pdf");
      } else {
        this.DWObject.SaveAsPDF(
          this.transactionNumber + ".pdf",
          this.DWObject.CurrentImageIndexInBuffer
        );
      }
    },
    close() {
      this.$emit("close");
    },
    submit() {
      this.DWObject.Viewer.fitWindow();
      let multipageTiffString = "";
      this.DWObject.TIFFCompressionType = 4; //sets compression to ccitt
      let indexArr = [];
      for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++) {
        indexArr.push(i);
      }
      /*
      empty image buffer edge case
      if (!this.DWObject.HowManyImagesInBuffer) {
        this.$emit("submitClicked", "");
        return;
      }
      */
      this.DWObject.ConvertToBase64(
        indexArr,
        Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF,
        base64Result => {
          multipageTiffString = base64Result.getData(
            0,
            base64Result.getLength()
          );
          //this.$emit("submitClicked", multipageTiffString); send tiff string of images to parent component and send to endpoint
          this.deleteAllPages();
        },
        (errorCode, errorString) => {
          console.log(
            "images not black and white, trying different compression"
          );
          this.DWObject.TIFFCompressionType = 7;
          this.DWObject.ConvertToBase64(
            indexArr,
            Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF,
            base64Result => {
              multipageTiffString = base64Result.getData(
                0,
                base64Result.getLength()
              );
              //this.$emit("submitClicked", multipageTiffString);
              this.deleteAllPages();
            },
            (errorCode, errorString) => {
              console.error(errorString);
              $("#loadingWrapper").fadeOut();
            }
          );
        }
      );
      this.deleteAllPages();
    },
    darken() {
      this.DWObject.ConvertToBase64(
        [this.DWObject.CurrentImageIndexInBuffer],
        Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
        base64Result => {
          this.changeImageBrightness(
            base64Result.getData(0, base64Result.getLength()),
            "Dark"
          );
        },
        function (errorCode, errorString) {
          console.error(errorString);
        }
      );
    },
    lighten() {
      this.DWObject.ConvertToBase64(
        [this.DWObject.CurrentImageIndexInBuffer],
        Dynamsoft.DWT.EnumDWT_ImageType.IT_PNG,
        base64Result => {
          this.changeImageBrightness(
            base64Result.getData(0, base64Result.getLength()),
            "Light"
          );
        },
        function (errorCode, errorString) {
          console.error(errorString);
        }
      );
    },
    deleteAllPages() {
      this.DWObject.RemoveAllImages();
    },
    deleteSelected() {
      this.DWObject.RemoveAllSelectedImages();
    },
    changeImageBrightness(base64, lightOrDark) {
      $.ajax({
        method: "POST",
        url: "http://127.0.0.1:8085/brightness",
        dataType: "json",
        async: true,
        beforeSend: function () {
          $("#loadingWrapper").fadeIn();
        },
        data: {
          send: JSON.stringify({
            base64: base64,
            lightOrDark: lightOrDark
          })
        }
      })
        .done(msg => {
          this.reloadEditedImage(msg.data);
        })
    },
    loadExistingImage() {
      if (this.existingImage != undefined && this.existingImage.length > 0) {
        this.DWObject.LoadImageFromBase64Binary(
          this.existingImage,
          Dynamsoft.DWT.EnumDWT_ImageType.IT_TIF,
          function () {
            $("#loadingWrapper").fadeOut();
          },
          function (e) {
            console.error(e);
            $("#loadingWrapper").fadeOut();
          }
        );
      }
    },
    reloadEditedImage(base64) {
      let oldSelected = this.DWObject.CurrentImageIndexInBuffer;
      this.DWObject.LoadImageFromBase64Binary(
        base64,
        3,
        () => {
          this.DWObject.SwitchImage(
            oldSelected,
            this.DWObject.HowManyImagesInBuffer - 1
          );
          this.DWObject.RemoveImage(this.DWObject.HowManyImagesInBuffer - 1);
          this.DWObject.Viewer.fitWindow();
          $("#loadingWrapper").fadeOut();
        },
        () => {
          $("#loadingWrapper").fadeOut();
        }
      );
    },
    AcquireImage() {
      const OnAcquireImageSuccess = () => {
        this.DWObject.CurrentImageIndexInBuffer = 0;
        this.DWObject.Viewer.fitWindow();
      };
      const OnAcquireImageFailure = (errCode, errString) => {
        console.error({ errCode, errString });
        if (errCode === -1003) {
          //No scanners found
          this.retry = true;
          this.showNoScannerDialog = true;
          this.$nextTick(() => {
            this.DWObject.Viewer.hide();
          });
        }
      };
      this.DWObject.CloseSource();
      this.DWObject.OpenSource();
      this.DWObject.AcquireImage(
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
        OnAcquireImageSuccess,
        OnAcquireImageFailure
      );
    },
    selectSource() {
      Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer").SelectSource();
    },
    deskew() {
      //this is for manual software deskew, scanner should be set to do this if it can, this is removed because it adds a lot of lag time

      let angle = this.DWObject.GetSkewAngle(
        this.DWObject.CurrentImageIndexInBuffer
      );
      this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, angle, 0);
    },
    removeBlanks() {
      this.DWObject.BlankImageMaxStdDev = this.blankPageSensitivity;
      if (this.DWObject.IsBlankImage(this.DWObject.CurrentImageIndexInBuffer)) {
        this.DWObject.RemoveImage(this.DWObject.CurrentImageIndexInBuffer);
      }
    },
    postTransfer() {
      this.removeBlanks();
    },
    onReady() {
      this.DWObject = Dynamsoft.DWT.GetWebTwain("dwtcontrolContainer");
      Dynamsoft.DWT.Containers = [{
            ContainerId: 'dwtcontrolContainer',
        }];
      
        this.DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
      if (this.DWObject) {
        this.DWObject.IfUseTwainDSM = true; // Remove the option for WIA drivers
        this.DWObject.IfShowProgressBar = false;
        this.DWObject.IfShowCancelDialogWhenImageTransfer = false;
        this.DWObject.RegisterEvent("OnPostTransfer", this.postTransfer);
        this.DWObject.RegisterEvent("OnPostAllTransfers", () => {
          this.DWObject.CloseSource();
        });
        this.DWObject.Viewer.background = "rgba(0, 0, 0, 0.35)";
        this.DWObject.Viewer.width = "100%";
        this.DWObject.Viewer.height = 700;

        setTimeout(() => {
          this.loadExistingImage();
        }, 200);

        this.thumbnailViewer = this.DWObject.Viewer.createThumbnailViewer({
          size: "20%"
        });

        this.thumbnailViewer.show();

        this.DWObject.Viewer.on("pageAreaSelected", (sImageIndex, rect) => {
          this.leftVertex = rect[0].x;
          this.rightVertex = rect[0].x + rect[0].width;
          this.topVertex = rect[0].y;
          this.bottomVertex = rect[0].y + rect[0].height;
        });

        this.DWObject.Viewer.singlePageMode = true;
      }

      if (this.retry === true) {
        // Already warned user about no scanner
        this.AcquireImage();
        return;
      }

      if (this.DWObject.GetSourceNames().length === 0) {
        //No scanners found
        this.DWObject.Viewer.hide();
        this.showNoScannerDialog = true;
      }
    },
    retryScan() {
      this.showNoScannerDialog = false;
      Dynamsoft.DWT.Unload();
      Dynamsoft.DWT.Load();
    }
  }
};
</script>

<style scoped>
.closeModalButtonRight {
  float: right;
}

.mainModal {
  max-width: 100%;
  max-height: 100%;
  text-align: center;
}

.imgContain {
  display: flex;
  flex-direction: row;
  width: 100%;
}
#controls {
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: 10%;
  min-width: 160px;
  margin-left: 15px;
}
#dwtcontrolContainer {
  width: 88%;
}
#controls button {
  width: 150px;
}
#controls button {
  margin: 5px 0 0 0;
}

#topOptions {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
}

#topOptions button {
  margin: 5px;
}
.scanner-window {
  height: 90vh;
}
.dialogMain {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
.scan-close-modal {
  text-align: center;
  padding: 25px;
}
</style>

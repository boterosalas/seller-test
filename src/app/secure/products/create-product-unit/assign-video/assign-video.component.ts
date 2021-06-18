import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService } from "@app/core";
import { SupportService } from "@app/secure/support-modal/support.service";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";
import { ProcessService } from "../component-process/component-process.service";
import { AssignVideoService } from "./assign-video.service";

@Component({
  selector: "app-assign-video",
  templateUrl: "./assign-video.component.html",
  styleUrls: ["./assign-video.component.scss"],
})
export class AssignVideoComponent implements OnInit {
  createVideo: FormGroup;
  imgUrl: String;
  _detailProduct: any;
  BrandsRegex = { videoUrl: '' };

  /**
   * toma los valores actuales del arreglo y se llena el input con info del back
   */

  @Input() set detailProduct(value: any) {
    if (value !== undefined) {
      this._detailProduct = value;

      if (this.createVideo && this.createVideo.controls) {
        this.createVideo.controls.inputVideo.setValue(value.videoUrl);
        this.validateVideo();
      }
    }
  }

  constructor(
    private fb: FormBuilder,
    private _video: AssignVideoService,
    private loadingService: LoadingService,
    private componentService: ComponentsService,
    private languageService: TranslateService,
    private process: ProcessService,
    public SUPPORT?: SupportService,
  ) {
    this.imgUrl = "./assets/img/no-image.svg";
  }

  ngOnInit() {
    this.createFormControls();
    this.validateFormSupport();
  }

    /**
   * Metodo para crear formulario del filtro
   * @memberof SellerRatingComponent
   */
     createFormControls() {
      this.createVideo = this.fb.group({
        inputVideo: ["", Validators.pattern(this.BrandsRegex.videoUrl)],
      });
    }

   /**
   * Funcion para cargar datos de regex
   * @memberof SellerRatingComponent
   */
    public validateFormSupport(): void {
      this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
        let dataOffertRegex = JSON.parse(res.body.body);
        dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'productos');
        for (const val in this.BrandsRegex) {
          if (!!val) {
            const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
            this.BrandsRegex[val] = element && `${element.Value}`;
          }
        }
        this.createFormControls();
      });
    }

  /**
   * 
   * @returns se valida el video (Que exista) y se le pone la img de youtube
   */

  public validateVideo() {
    if (this.createVideo.controls.inputVideo.hasError("pattern")) {
      this.imgUrl = "./assets/img/no-image.svg";
      return;
    } else {
      let videoValue = this.createVideo.controls.inputVideo.value;
      this.loadingService.viewSpinner();
      this._video.getvalidateVideo(videoValue).subscribe((resp) => {
        this.loadingService.closeSpinner();
        let body = JSON.parse(resp.body);
        if (resp.statusCode === 200) {
          if (body.Data.IsValid === false) {
            this.componentService.openSnackBar(
              body.Message,
              this.languageService.instant("actions.close"),
              3000
            );
            this.imgUrl = "./assets/img/no-image.svg";
          } else {
            this.imgUrl = body.Data.UrlImage;
            const data = { videoUrl: videoValue };
            this.process.validaData(data);
          }
        }

        if (resp.statusCode === 400) {
          this.componentService.openSnackBar(
            body.Message,
            this.languageService.instant("actions.close"),
            3000
          );
        }
      });
    }
  }
}

import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Logger } from '@app/core/util/logger.service';
import { UserInformation } from '@app/shared';
import { UserParametersService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DeleteProductModalComponent } from './delete-product-modal/delete-product-modal.component';

const log = new Logger('ExpandedProductComponent');

@Component({
    selector: 'app-expanded-product',
    templateUrl: 'expanded-product.component.html',
    styleUrls: ['expanded-product.component.scss'],
})
export class ExpandedProductComponent implements OnInit {

    @Input() productsExpanded: any;
    @Input() offerPermission: boolean;
    @Input() editPermission: boolean;
    @Input() isAdmin: boolean;
    @Input() deletePermission: boolean;
    @Output() reloadDataListProduct = new EventEmitter<any>();

    /* arreglo q contiene las imagenes grandes y pequeñas */
    public images = [];
    public listKeywords = [];

    public applyOffer: any;
    public dialogRef : any;

    /* variable que contiene la ruta de la imagen grande */
    public imageMax: string;
    imageLength: number;
    public user: UserInformation;
    public showOfer: boolean;

    constructor(
        private router: Router,
        public dialog: MatDialog,
        private userParams?: UserParametersService,
    ) { }


    ngOnInit() {
        this.createArrayImages();
        this.applyOffert();
        this.getDataUser();
        const startswithModel = !!this.productsExpanded.model && (this.productsExpanded.model.toString() as string).toLowerCase().startsWith('modelo');
        this.productsExpanded.model = startswithModel ? (this.productsExpanded.model.toString() as string).slice(6, this.productsExpanded.model.length) : this.productsExpanded.model;
    }

    async getDataUser() {
        this.user = await this.userParams.getUserData();
        if (this.user.sellerProfile === 'seller') {
            this.showOfer = false;
        }
    }

    /* funcion que cambia el valor de la variable que contiene la url de la imagen grande y recibe como parametro la url de la imagen grande */
    changeImage(image: any) {
        this.imageMax = image;
    }

    public createArrayImages(): void {
        const minImages: any[] = this.productsExpanded.smallImage;
        const maxImages: any[] = this.productsExpanded.mediumImage;
        let i = 0;
        for (i; i < this.productsExpanded.mediumImage.length; i++) {
            const min = minImages[i];
            const max = maxImages[i];
            this.images.push({ min, max });
        }
        this.imageMax = this.images[0] && this.images[0]['max'];
        this.imageLength = this.images.length;
    }

    applyOffert(): void {
        this.applyOffer = this.productsExpanded;
    }
    editProduct(productsExpanded: any) {
        this.router.navigate(['securehome/products/creacion-unitaria', { ean: productsExpanded.ean, reference: productsExpanded.reference }]);
    }
    deleteProduct(productsExpanded: any) {
        this.openModalDownloadOrder(productsExpanded);
    }

    openModalDownloadOrder(data: any): void {
       this.dialogRef  = this.dialog.open(DeleteProductModalComponent, {
            data: {
                data: data,
            },
            width: '50%',
        });
        const dialogIntance = this.dialogRef.componentInstance;
        dialogIntance.processFinish$.subscribe((val) => {
            this.reloadDataListProduct.emit();
        });
    }
    // ngOnDestroy() {
    //     this.dialogRef.close();
    //   }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-create-unutary-product',
  templateUrl: './create-unutary-product.component.html',
  styleUrls: ['./create-unutary-product.component.scss']
})
export class CreateUnutaryProductComponent implements OnInit {
  ean: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if ( params['ean'] != null) {
        this.ean = params['ean'];
      }
    });
  }

}

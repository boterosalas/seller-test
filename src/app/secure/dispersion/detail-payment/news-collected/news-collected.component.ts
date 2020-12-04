import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-news-collected',
  templateUrl: './news-collected.component.html',
  styleUrls: ['./news-collected.component.scss']
})
export class NewsCollectedComponent implements OnInit {

  @Input() sellerData: any;

  constructor() { }

  ngOnInit() {
    console.log(2, this.sellerData);
  }

}

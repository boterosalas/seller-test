import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-products-pending-modification-modal",
  templateUrl: "./products-pending-modification-modal.component.html",
  styleUrls: ["./products-pending-modification-modal.component.scss"],
})
export class ProductsPendingModificationModalComponent implements OnInit {
  constructor() {}

  emailFormGroup: FormGroup;

  ngOnInit() {
    this.emailFormGroup = new FormGroup({
      email: new FormControl("", [Validators.email, Validators.required]),
    });
  }
}

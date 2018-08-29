import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[cdkDetailRow]'
})
export class CdkDetailRowDirective {

  /**
   * row
   */
  private row: any;
  /**
   * tRef
   */
  private tRef: TemplateRef<any>;
  /**
   * opened
   */
  private opened: boolean;

  /**
   * HostBinding
   */
  @HostBinding('class.expanded')
  /**
   * expended
   */
  get expended(): boolean {
    return this.opened;
  }

  /**
   * Input
   */
  @Input()
  /**
   * cdkDetailRow
   */
  set cdkDetailRow(value: any) {
    if (value !== this.row) {
      this.row = value;
      // this.render();
    }
  }

  /**
   * cdkDetailRowTpl
   */
  @Input('cdkDetailRowTpl')
  /**
   * template
   */
  set template(value: TemplateRef<any>) {
    if (value !== this.tRef) {
      this.tRef = value;
      // this.render();
    }
  }

  /**
   * Creates an instance of CdkDetailRowDirective.
   * @param {ViewContainerRef} vcRef
   * @memberof CdkDetailRowDirective
   */
  constructor(public vcRef: ViewContainerRef) { }

  /** HostListener */
  @HostListener('click')
  /** onClick */
  onClick(): void {
    this.toggle();
  }


  /** toggle */
  toggle(): void {
    if (this.opened) {
      this.vcRef.clear();
    } else {
      this.render();
    }
    this.opened = this.vcRef.length > 0;
  }


  /** render */
  private render(): void {
    this.vcRef.clear();
    if (this.tRef && this.row) {
      this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
    }
  }
}

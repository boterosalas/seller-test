import { Component, OnInit, Input} from '@angular/core';
import { Logger } from '@app/core';
import { EventEmitterDialogs } from './../../events/eventEmitter-dialogs.service';
import { FormControl , FormGroup, Validators} from '@angular/forms';
import { CreateDialogService } from './create-dialog.service';
import { TransportModel } from '../models/transport.model';
import { TypeTransportModel } from '../models/transports-type.model';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';

const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./../dialog.component.scss']
})
export class CreateDialogComponent implements OnInit {

  public formTransporter: FormGroup;
  public transportTypeList: Array<TypeTransportModel>;
  public dialogMode = false; // False: Add mode, True: Update mode.
  public transportDataToEdit: TransportModel;
  @Input() typeDialog: number;
  @Input() dataEdit: Array<{}>;

  constructor(
    private events: EventEmitterDialogs,
    private service: CreateDialogService,
    private serviceTransport: ListTransporterService
  ) { }

  ngOnInit(): void {
    log.debug(this.typeDialog);
    /** Verify if component initialization has data to edit or create  */
    if ( this.dataEdit !== null ) {
      this.dialogMode = true;
    } else {
      this.createTransportDialog(this.dataEdit);
    }
  }

  /**
   * Function to get required data to charge select in transport form.
   *
   * @memberof CreateDialogComponent
   */
  public getTransportMethodRequiredData(): void {
    this.transportTypeList = this.service.getFakeListTransporter();
  }

  public getTransportData(): void {
    // this.transportDataToEdit = this.service.get
  }

  closeDialog(): void {
    this.events.openDialogCreate(false);
  }

  /**  */
  createTransportDialog(dataEdit: any): void {
    this.getTransportMethodRequiredData();
    let name: string;
    let idMethod: number;
    if ( this.dataEdit ) {
      name = dataEdit.name;
      idMethod = dataEdit.idMethod;
    }
    this.formTransporter = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      typeTransport: new FormControl(idMethod, Validators.required)
    });
  }
}

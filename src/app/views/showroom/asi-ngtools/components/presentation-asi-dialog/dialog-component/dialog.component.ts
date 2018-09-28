import { AsiDialogView } from '@asi-ngtools/lib';
import { Component } from '@angular/core';

@Component({
  selector: 'dialog-test',
  templateUrl: './dialog.component.html',
})
export class DialogComponent extends AsiDialogView {

  public message: string = "";

  constructor() {
    super();
  }

}
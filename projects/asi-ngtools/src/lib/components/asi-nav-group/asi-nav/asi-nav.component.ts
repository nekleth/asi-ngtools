import { Input, Component, TemplateRef, ViewChild, ContentChild } from '@angular/core';
import { AsiComponentTemplateNavHeaderDef } from '../../common/asi-component-template';

@Component({
  selector: 'asi-nav',
  template: '<ng-template><ng-content></ng-content></ng-template>',
})
export class AsiNav {

  @Input() label: string;
  @Input() routerLink: string;
  @Input() readOnly: false;
  @Input() navClass: '';

  @ViewChild(TemplateRef, {static: true}) contentTemplate: TemplateRef<any>;

  @ContentChild(AsiComponentTemplateNavHeaderDef, {static: false}) headerDef: AsiComponentTemplateNavHeaderDef;

  public active: boolean;
  public index: Number;
}

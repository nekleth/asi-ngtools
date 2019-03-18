import {
  Component, Input, forwardRef, ContentChild, OnInit, OnChanges, Renderer2, ElementRef
} from '@angular/core';

import { DefaultControlValueAccessor } from './../../common/default-control-value-accessor';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { AsiComponentTemplateOptionDef, AsiComponentTemplateSelectedDef } from './../../common/asi-component-template';
import { debounceTime } from 'rxjs/operators';

/**
 * asi-autocomplete component
 */
@Component({
  selector: 'asi-autocomplete',
  templateUrl: 'asi-autocomplete.component.html',
  host: { 'class': 'asi-component asi-autocomplete' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiAutoCompleteComponent),
      multi: true
    }
  ]
})
export class AsiAutoCompleteComponent extends DefaultControlValueAccessor implements OnInit, OnChanges {

  /** html id */
  @Input() id: string;
  /** html name */
  @Input() name: string;

  /** Label to display (is translated) */
  @Input() label: string;

  /** Label position */
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = 'top';

  /** Delay between the moment you stop typing and onRequestData is called */
  @Input() delay = 500;

  /** A placeholder if needed */
  @Input() placeholder = '';

  /** Function called to request new data : Throw error if null */
  @Input() onRequestData: Function;

  @ContentChild(AsiComponentTemplateOptionDef) optionDef: AsiComponentTemplateOptionDef;
  @ContentChild(AsiComponentTemplateSelectedDef) selectedDef: AsiComponentTemplateSelectedDef;

  autoCompleteControl = new FormControl();

  open = false;

  data: Array<any>;

  // Var used to manage component initialization
  firstRequestDone: Boolean = null;
  init = false;

  private currentValue: any = null;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    super();
  }

  private checkInput() {
    if (null == this.onRequestData) {
      throw new Error('AsiAutoCompleteComponent : @Input \'onRequestData\' is required');
    }
  }

  ngOnInit() {
    this.checkInput();

    this.renderer.addClass(this.elementRef.nativeElement, 'label-' + this.labelPosition);

    this.autoCompleteControl.valueChanges.pipe(debounceTime(this.delay))
      .subscribe(value => {
        this.currentValue = value;
        Promise.resolve(this.onRequestData(value)).then((data) => {
          this.data = data;
          if (this.firstRequestDone && data && data.length > 0) {
            this.open = true;
          }
          this.firstRequestDone = true;
        });
      });
  }

  onDropdownClose() {
    this.open = false;
  }

  ngOnChanges() {
    if (this.init) {
      this.open = true;
    } else {
      if (this.firstRequestDone) {
        this.init = true;
      }
    }
  }

  selectValue(data: any) {
    this.value = data;
    this.open = false;
  }

  clearValue() {
    this.value = null;
    this.autoCompleteControl.setValue(this.currentValue, { emitEvent: false });
    setTimeout(() => { this.open = true });
  }

  writeValue(value: any) {
    if (this.init === false) {
      this.autoCompleteControl.setValue(this.currentValue);
    } else {
      this._value = value;
      this.currentValue = value;
      if (this.value == null) {
        this.autoCompleteControl.setValue(this.currentValue, { emitEvent: false });
      }
    }
  }
}

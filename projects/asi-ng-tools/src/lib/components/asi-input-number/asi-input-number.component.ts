import { DefaultControlValueAccessor } from './../common/default-control-value-accessor';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Component, forwardRef, Input, ElementRef, AfterContentInit, OnInit, ViewChild, HostBinding } from '@angular/core';


@Component({
  selector: 'asi-input-number',
  templateUrl: 'asi-input-number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiInputNumberComponent),
      multi: true
    }
  ]
})
export class AsiInputNumberComponent extends DefaultControlValueAccessor implements AfterContentInit, OnInit {

  @HostBinding('class') class = 'asi-component asi-input-number';

  @Input() id: string;
  @Input() name: string;

  @Input() label: string;
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = 'top';
  @Input() step = 1;
  @Input() disableInput = false;

  @Input() hiddeAction = false;

  @Input() min: Number;
  @Input() max: Number;

  @ViewChild('input') inputElm: ElementRef;

  inputControl = new FormControl();
  pattern = new RegExp('^-*[0-9]*$');

  constructor() {
    super();
  }

  ngOnInit() {
    this.class += ' label-' + this.labelPosition;
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.inputControl.valueChanges.subscribe((value) => {
        if (value === '') {
          value = null;
        }
        if (value != null && this.pattern.test(value)) {
          if (this.max != null && value > this.max) {
            value = this.max;
          }
          if (this.min != null && value < this.min) {
            value = this.min;
          }
          this.value = Number(value);
        } else if (value == null) {
          this.value = Number(value);
        }
        this.inputElm.nativeElement.value = this._value;
      });
    });
  }

  increase() {
    if (!this.value) {
      this.value = 0;
    } else if (this.max == null || this.value < this.max) {
      this.value = this.value + this.step;
    }
  }

  decrease() {
    if (this.value == null) {
      this.value = 0;
    } else if (this.min == null || this.value > this.min) {
      this.value = this.value - this.step;
    }
  }

  writeValue(value: any) {
    if (value == null || this.pattern.test(value)) {
      this._value = value;
    } else {
      this.inputElm.nativeElement.value = 'Incorrect value';
    }
  }
}
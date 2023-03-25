// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { fromEvent, Subject, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LoginFormComponent),
      multi: true
    }       
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ]
})
export class LoginFormComponent implements ControlValueAccessor, Validator, OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();  
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid 
    ? null
    : Object.keys(this.form.controls).reduce((accumulatedErrors,formControlName) => { 
      const errors = {...accumulatedErrors} as any;
      
      const controlErrors = this.form.get(formControlName)!.errors;

      if (controlErrors) {
        errors[formControlName] = controlErrors;
      }
      
      return errors;
    }, { });      
  }

  public form = new FormGroup<any>({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  writeValue(obj: any): void {
    if(obj) {
      this.form.patchValue(obj);
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe(fn);
  }

  registerOnTouched(fn: any): void {  
    this._elementRef.nativeElement.querySelectorAll("*").forEach(
      (element: HTMLElement) => {
        fromEvent(element,"blur")
        .pipe(
          takeUntil(this._destroyed$),
          tap(x => fn())
        ).subscribe();
      }
    )    
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}

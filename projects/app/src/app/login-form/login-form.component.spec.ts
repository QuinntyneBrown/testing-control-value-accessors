// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        ReactiveFormsModule,
        LoginFormComponent 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form.pristine).toBeTruthy();
  });

  it('should return errors when validated without values', () => {
    const validationResult = component.validate(component as unknown as FormControl) as ValidationErrors;

    expect(validationResult["password"].required).toEqual(true);
    expect(validationResult["username"].required).toEqual(true); 
  });

  it('should return no errors when validated with values', () => {

    component.writeValue({
      username:"username",
      password: "password"
    });

    const validationResult = component.validate(component as unknown as FormControl) as ValidationErrors;

    expect(validationResult).toBeFalsy();

  });

  it('should execute callback on change via patch value', () => {
    
    let changed = false;

    component.registerOnChange(() => changed = true);

    component.form.get("username")!.patchValue("foo");

    expect(changed).toBeTruthy();

    expect(component.form.pristine).toBeTruthy();
  });

  it('should execute callback on change via setValue', () => {
    
    let changed = false;

    component.registerOnChange(() => changed = true);

    component.form.get("username")!.setValue("foo");

    expect(changed).toBeTruthy();

    expect(component.form.pristine).toBeTruthy();
  });

  it('should set form to dirty when username has changed', () => {

    const expectedValue = "Quinn";

    let changed = false;

    component.registerOnChange(() => changed = true);

    var usernameInputElement = fixture.debugElement.query(By.css("input[type=text]"));

    usernameInputElement.nativeElement.value = expectedValue;

    usernameInputElement.triggerEventHandler('input', {target: usernameInputElement.nativeElement});
    
    fixture.detectChanges();

    expect(usernameInputElement).toBeTruthy();

    expect(fixture.componentInstance.form.pristine).toBeFalsy();

    expect(fixture.componentInstance.form.value.username).toEqual(expectedValue);

    expect(changed).toBeTruthy();

  });

});


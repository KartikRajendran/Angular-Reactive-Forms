import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { passwordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private registrationService: RegistrationService) { }

  get userName() {
    return this.registrationForm.get('userName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get alternateEmails() {
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmails() {
    this.alternateEmails.push(this.fb.control(''));
  }

  ngOnInit(): void {

    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validators: passwordValidator});

    this.registrationForm.get('subscribe').valueChanges
        .subscribe(checkedValue => {
          const email = this.registrationForm.get('email');
          if (checkedValue) {
            email.setValidators(Validators.required);
          } else {
            email.clearValidators();
          }
          email.updateValueAndValidity();
        });
  }

  /** Simple Form Assignment */
  // registrationForm = new FormGroup({
  //   userName: new FormControl('Kartik'),
  //   password: new FormControl(''),
  //   confirmPassword: new FormControl(''),
  //   address: new FormGroup({
  //     city: new FormControl(''),
  //     state: new FormControl(''),
  //     postalCode: new FormControl('')
  //   }),
  // });

  loadApi() {
    this.registrationForm.setValue({
      userName: 'Manish',
      password: 'secret',
      confirmPassword: 'secret',
      address: {
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380006'
      }
    });
  }

  loadApiPatch() {
    this.registrationForm.patchValue({
      userName: 'Aravind',
      password: 'secret',
      confirmPassword: 'secret',
   });
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    this.registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('success', response),
        error => console.log('Error', error )
      );
  }
}

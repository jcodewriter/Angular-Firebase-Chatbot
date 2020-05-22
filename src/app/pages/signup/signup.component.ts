import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { Alert } from 'src/app/classes/alert';
import { AlertType } from 'src/app/enums/alert-type.enum';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';
import { Address } from 'src/app/classes/address';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  constructor(
    public fb: FormBuilder,
    private alertService: AlertService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private router: Router
    ) {
    this.createForm();
  }

  public signUpForm: FormGroup;
  private subscriptions: Subscription[] = [];
  public Address: Address;
  public genderCode: string;
  public gender: string;

  employment: any = [
    'Unemployed',
    'Student',
    'Self-Employed',
    'Employed-Permanent',
    'Employed-Contract'
  ];

  education: any = [
    'Lower Than Matric',
    'Matric',
    'National Certificate', 'Diploma',
    'Degree',
    'Honours',
    'Masters',
    'PHD'
  ];

 selectedEmp = '';
 selectedEd = '';

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private createForm(): void {
    this.signUpForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      idNumber: ['', [Validators.required, Validators.minLength(8)]],
      age: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      employmentStatus: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
      votingStation: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  public submit(): void {
    if (this.signUpForm.valid) {
      const {firstname, lastname, email, idNumber, age, qualification, employmentStatus, addressLine1,
        addressLine2, postalCode, city, country, votingStation, password} = this.signUpForm.value;

      this.Address = {
          addressLine1,
          addressLine2,
          postalCode,
          city,
          country
        };

      // get the gender
      this.genderCode = idNumber.substring(6, 10);
      // tslint:disable-next-line: radix
      this.gender = parseInt(this.genderCode) < 5000 ? 'Female' : 'Male';
      // TODO call the auth service
      this.subscriptions.push(
        this.auth.signup(firstname, lastname, email, idNumber, age, this.gender, qualification,
          employmentStatus, this.Address, votingStation, password).subscribe(success => {
          if (success) {
            this.router.navigate(['/chat']);
          } else {
            const failedSignUpAlert = new Alert('There was a problem signing up, try again.', AlertType.Danger);
            this.alertService.alerts.next(failedSignUpAlert);
          }
          this.loadingService.isLoading.next(false);
        })
      );
    } else {
      const failedSignUpAlert = new Alert('Please enter all valid information on the form, try again.', AlertType.Danger);
      this.alertService.alerts.next(failedSignUpAlert);
    }
  }
}

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CountryService } from '../../services/locations/country.service';
import { StateService } from '../../services/locations/state.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditProfileService } from '../../services/account/edit-profile.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  @Input() user: any;
  userData: any = localStorage.getItem('userData');

  avatar?: string;
  editAvatarForm: FormGroup = new FormGroup({});
  editGeneralForm: FormGroup = new FormGroup({});
  editEducationForm: FormGroup = new FormGroup({});
  @ViewChild('block') block?: ElementRef;

  token: string = JSON.parse(localStorage.getItem('token') as string)
  countries: any;
  states: any;
  errorMessage?: string;
  avatarError?: string;
  avatarSuccess?: string;
  generalError?: string;
  generalSuccess?: string;

  constructor(private countryService: CountryService, private stateService: StateService, private editProfileService: EditProfileService) { }

  ngOnInit(): void {
    console.log(this.user);
    this.avatar = this.user.avatar;
    console.log(this.avatar);


    //avatar form 
    this.editAvatarForm = new FormGroup({
      avatar: new FormControl(this.avatar)
    })


    //general info form 
    this.editGeneralForm = new FormGroup({
      fname: new FormControl(this.user.fname, [Validators.required]),
      lname: new FormControl(this.user.lname, Validators.required),
      bio: new FormControl(this.user.bio, Validators.required),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      gender: new FormControl(this.user.gender, Validators.required),
      country_id: new FormControl(this.user.country.id),
      state_id: new FormControl(this.user.state.id)
      // password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      // password_confirmation: new FormControl('', Validators.required),
    });


    this.editEducationForm = new FormGroup({
      education: new FormArray([
      ])
    })



    // Fetch countries
    this.countryService.getCountries().subscribe(
      countries => {
        this.countries = countries.data.countries;
        console.log(this.countries);
      },
      error => {
        console.error('Error fetching countries:', error);
      }
    );

    // Subscribe to country_id value changes
    this.editGeneralForm.get('country_id')?.valueChanges.subscribe(countryId => {
      console.log(countryId);

      if (countryId) {

        // Fetch states for the selected country
        this.stateService.getStates(countryId).subscribe(
          states => {
            this.states = states.data.country.states;
            console.log(this.states);
          },
          error => {
            console.error('Error fetching states:', error);
          }
        );
      }
    });
  }

  editAvatar() {

    const formData = new FormData();
    const file = this.editAvatarForm.get('avatar')?.value;
    console.log(file);
    console.log(this.editAvatarForm.value);

    if (file instanceof File) {
      formData.append('avatar', file);
      console.log('llll', formData);
    }

    // Send the form data to the backend
    this.editProfileService.changeAvatar(this.token, formData).subscribe(
      response => {
        console.log(response);
        this.avatarSuccess = 'Avatar updated successfully';
      },
      error => {
        console.log(error);
        this.avatarError = error.error.errors.avatar[0];
        console.log(this.avatarError);
      }
    );
  }
  removeAvatar() {
    const removeAvatar = confirm("Are you sure you want to delete your avatar?");
    if (removeAvatar) {
      this.editProfileService.removeAvatar(this.token).subscribe(response => {
        this.generalError = (response as any).message
      },
        error => {
          console.log(error);
          this.generalError = error.error.message
        })
    }


  }
  editGeneral() {
    console.log(this.editGeneralForm.value);

    this.editProfileService.changeGeneralInfo(this.token, this.editGeneralForm.value).subscribe(response => {
      console.log(response);
      this.generalSuccess = 'Info updated successfully';

    },
      error => {
        console.log(error);
        this.generalError = error.error.message
      })
  }


  addEducation() {
    this.block?.nativeElement.insertAdjacentHTML('beforeend', `
    <div class="card p-3 my-3">
    <div class="row mb-3">
        <label for="degree" class="col-md-4 col-lg-3 col-form-label">Degree Name</label>
        <div class="col-md-8 col-lg-9">
            <input name="degree" type="text" class="form-control" id="degree"
                 />
        </div>
    </div>
    <div class="row mb-3">
        <label for="start_date" class="col-md-4 col-lg-3 col-form-label">Start date</label>
        <div class="col-md-8 col-lg-9">
            <input type="date" name="start_date" class="form-control" id="start_date"
                />
        </div>
    </div>
    <div class="row mb-3">
        <label for="end_date" class="col-md-4 col-lg-3 col-form-label">End date</label>
        <div class="col-md-8 col-lg-9">
            <input type="date" name="end_date" class="form-control" id="end_date"
                />
        </div>
    </div>
</div>
    `);

  }

  get imageSrc(): any {
    return this.avatar
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        this.avatar = base64String; // Display the image as base64
        this.editAvatarForm.get('avatar')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }

  }

  cancelImage() {
    this.editAvatarForm.get('avatar')?.setValue('');
    // Optionally, you can clear the file input value as well
    const inputElement = document.getElementById('uploadImage') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}
import { Component, Input } from '@angular/core';
import { NgbNav, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';
import { PageTitleComponent } from '../partials/page-title/page-title.component';


@Component({
  selector: 'app-support-us-page',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './support-us-page.component.html',
  styleUrls: ['./support-us-page.component.css', '../../assets/css/style.css']
})
export class SupportUsPageComponent {
  @Input() course: any;
}

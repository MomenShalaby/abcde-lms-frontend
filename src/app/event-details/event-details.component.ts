import { Component, OnInit } from '@angular/core';
import { Event, EventWithAttendees } from '../core/models/event.model';
import { EventService } from '../core/services/events/event-service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from '../services/users/users.service';
import { Tag } from '../core/models/tag.model';
import { TagService } from '../core/services/tags/tag.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css', '../../assets/css/style.css']
})
export class EventDetailsComponent implements OnInit{
  events: Event[] = [];
  event: EventWithAttendees = {} as EventWithAttendees;
  eventId: number = 0;
  tags: Tag[] = [];
  isAuthenticated: boolean = false;

  constructor(private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UsersService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.getEventById();
    this.getEvents();
    this.getTags();
  }

  getEventById(){
    this.activatedRoute.paramMap.subscribe( params => {
      this.eventId = Number(params.get("id"));
      if(!this.eventId) return;
      this.eventService.getEventById(this.eventId).subscribe({
        next: (res) => {
          this.event = res.data;
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }

  enrollToEvent(){
    debugger
    if(!this.userService.isAuthenticated.value){
      this.router.navigate(['/login']);
    }
    this.eventService.enrollToEvent(this.eventId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getEvents(){
    this.eventService.getEvents().subscribe({
      next: (res) => {
        this.events = res.data.slice(0, 3);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getTags(){
    this.tagService.getTags().subscribe({
      next: (res) => {
        this.tags = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}

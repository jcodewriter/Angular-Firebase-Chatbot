import { Component, OnInit, OnDestroy, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-chatroom-window',
  templateUrl: './chatroom-window.component.html',
  styleUrls: ['./chatroom-window.component.scss']
})
export class ChatroomWindowComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scrollContainer', {static: false}) private scrollContainer: ElementRef;

  private subscriptions: Subscription[] = [];
  public chatroom: Observable<any>;
  public messages: Observable<any>;

  // TODO replace with database data
  // public dummyData = [
  //   {
  //     message: 'Sed, enim velit',
  //     createdAt: new Date(),
  //     sender: {
  //       firstname: 'Meluleki',
  //       lastname: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Sed, enim velit, condimentum nec tincidunt non',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Minenhle',
  //       lastName: 'Zondi',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Quisque ornare dapibus convallis.',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Onethemba',
  //       lastName: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Quisque ornare dapibus convallis.',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Onethemba',
  //       lastName: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Quisque ornare dapibus convallis.',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Onethemba',
  //       lastName: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Quisque ornare dapibus convallis.',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Onethemba',
  //       lastName: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   },
  //   {
  //     message: 'Quisque ornare dapibus convallis.',
  //     createdAt: new Date(),
  //     sender: {
  //       firstName: 'Onethemba',
  //       lastName: 'Madlala',
  //       photoUrl: 'http://via.placeholder.com/50x50'
  //     }
  //   }
  // ];

  constructor(
    private route: ActivatedRoute,
    private chatroomService: ChatroomService,
    private loadingService: LoadingService
  ) {
    this.subscriptions.push(
      this.chatroomService.selectedChatroom.subscribe(chatroom => {
        this.chatroom = chatroom;
      })
    );

    this.subscriptions.push(
      this.chatroomService.selectedChatroomMessages.subscribe(messages => {
        this.messages = messages;
      })
    );
  }

  ngOnInit() {
    this.scrollToBottom();
    this.subscriptions.push(
      this.route.paramMap.subscribe(params => {
        const chatroomId = params.get('chatroomId');
        this.chatroomService.changeChatroom.next(chatroomId);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}

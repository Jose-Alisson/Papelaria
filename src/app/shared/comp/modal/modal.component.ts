import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Output()
  close: EventEmitter<boolean> = new EventEmitter()

  @Input()
  title: string = "modal"

  @Input()
  modalStyle: { [klass: string]: any; } | null | undefined
}

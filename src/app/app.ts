import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppFacade } from './facades';
import { UiService } from './services/ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {
  facade = inject(AppFacade);
  isMenuOpen = false

  ngOnInit() {
    this.facade.loadAllData();
  }

  ui = inject(UiService);

  confirmAction() {
    this.ui.dialog().onConfirm();
    this.ui.closeConfirm();
  }
}
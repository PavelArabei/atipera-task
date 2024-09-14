import {
  ChangeDetectionStrategy, Component, inject, OnInit
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/components/footer/footer.component';
import { HeaderComponent } from '@core/components/header/header.component';
import { IconRegisterService } from '@core/services/icon-register.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private readonly iconRegisterService = inject(IconRegisterService);

  ngOnInit(): void {
    this.iconRegisterService.registerIcons();
  }
}

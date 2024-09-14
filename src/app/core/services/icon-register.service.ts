import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { icons } from '@icons/icons';

@Injectable({
  providedIn: 'root'
})
export class IconRegisterService {
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  private add(name: string, source: string) {
    this.iconRegistry.addSvgIconLiteral(
      name,
      this.sanitizer.bypassSecurityTrustHtml(source)
    );
  }

  public registerIcons() {
    icons.forEach(({ iconName, icon }) => {
      this.add(iconName, icon);
    });
  }
}

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard',   route: '/dashboard' },
    { label: 'Topics',    icon: 'category',     route: '/topics'    },
    { label: 'Problems',  icon: 'format_list_bulleted', route: '/problems' },
    { label: 'Revisit',   icon: 'bookmark',     route: '/revisit'   },
    { label: 'Stats',     icon: 'bar_chart',    route: '/stats'     },
  ];
}

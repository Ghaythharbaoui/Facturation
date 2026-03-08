import { Component, signal, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  pageTitle = signal('Tableau de bord');

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateTitleByUrl(event.urlAfterRedirects);
    });
  }

  private updateTitleByUrl(url: string): void {
    if (url.includes('/products')) this.pageTitle.set('Gestion des Produits');
    else if (url.includes('/categories')) this.pageTitle.set('Gestion des Catégories');
    else if (url.includes('/dashboard')) this.pageTitle.set('Tableau de bord');
    else this.pageTitle.set('FactureStock');
  }

  isSidebarCollapsed(): boolean {
    return this.sidebar?.collapsed() ?? false;
  }
}

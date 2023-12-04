import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AccountComponent } from './account/account.component';
import { ListsComponent } from './lists/lists.component';

export const routes: Routes = [
    {path: "", component: HomepageComponent},
    {path: "account", component: AccountComponent},
    {path: "lists", component: ListsComponent},
];

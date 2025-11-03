import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'repository-policy',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './repository-policy.component.html',
  styleUrls: ['./repository-policy.component.scss']
})
export class RepositoryPolicyComponent { }
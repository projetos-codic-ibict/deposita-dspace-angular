import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DSpaceObject } from '../../../../../../../../app/core/shared/dspace-object.model';
import {
  hasValue,
  isEmpty,
} from '../../../../../../../../app/shared/empty.util';
import { getResourceTypeValueFor } from '../../../../../../../../app/core/cache/object-cache.reducer';

@Component({
  selector: 'ds-themed-type-badge',
  templateUrl: './type-badge.component.html',
  standalone: true,
  imports: [TranslateModule, CommonModule],
})
export class TypeBadgeComponent {
  private _object: DSpaceObject;
  private _typeMessage: string;

  @Input() set object(object: DSpaceObject) {
    this._object = object;

  
    const renderTypes = this._object.getRenderTypes();
    if (!isEmpty(renderTypes.length)) {
      const renderType = renderTypes[0];
      if (renderType instanceof Function) {
        const resourceTypeValue = getResourceTypeValueFor(object.type);
        if (hasValue(resourceTypeValue)) {
          this._typeMessage =
            this.getTypeMessageFromResourceTypeValue(resourceTypeValue);
        } else {
          this._typeMessage = this.getTypeMessageFromResourceTypeValue(
            renderType.name
          );
        }
      } else {
        this._typeMessage =
          this.getTypeMessageFromResourceTypeValue(renderType);
      }
    }
  }

  private getTypeMessageFromResourceTypeValue(resourceTypeValue: string) {
    resourceTypeValue = resourceTypeValue.toLowerCase();

    if (resourceTypeValue === 'item') {
      return this._object.firstMetadataValue('dc.type');
    }

    return `${resourceTypeValue}.listelement.badge`;
  }

  get object(): DSpaceObject {
    return this._object;
  }

  get typeMessage(): string {
    return this._typeMessage;
  }


  private normalize(value: string): string {
    return value
      ?.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/\s+/g, ' ')
      .trim();
  }


  get typeStyle(): any {
    const normalizedType = this.normalize(this._typeMessage || '');

    const typeColors: Record<string, { background: string; color: string }> = {
      artigo: { background: '#007bff', color: '#fff' },
      'artigo de evento': { background: '#0056b3', color: '#fff' },
      'capitulo de livro': { background: '#218838', color: '#fff' },
      dissertacao: { background: '#6f42c1', color: '#fff' },
      livro: { background: '#28a745', color: '#fff' },
      tese: { background: '#e83e8c', color: '#fff' },
      'trabalho de conclusao de curso': {
        background: '#fd7e14',
        color: '#fff',
      },
    };

    return (
      typeColors[normalizedType] || { background: '#343a40', color: '#fff' }
    );
  }
}

import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataValue } from '../../../core/shared/metadata.models';
import { MetadataFieldWrapperComponent } from '../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { MetadataValuesComponent } from '../metadata-values/metadata-values.component';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-metadata-uri-values',
  styleUrls: ['./metadata-uri-values.component.scss'],
  templateUrl: './metadata-uri-values.component.html',
  imports: [
    MetadataFieldWrapperComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class MetadataUriValuesComponent extends MetadataValuesComponent {

  @Input() linktext: any;
  @Input() mdValues: MetadataValue[];
  @Input() separator: string;
  @Input() label: string;
  @Input() parentItem: Item;

  private doiUrlRegex = /^https:\/\/(doi\.org|doi\.test\.datacite\.org)\//i;
  private rawDoiRegex = /^10\.\d{4,9}\/.+$/i;

  // --------------------------------------------------
  // CONTROLE GLOBAL: ESTE COMPONENTE DEVE RENDERIZAR?
  // --------------------------------------------------
shouldRender(): boolean {
  if (!this.mdValues || this.mdValues.length === 0) {
    return false;
  }

  const itemDoi = this.findDoiInItem();

  // Se existe DOI no item, renderiza
  if (itemDoi) {
    return true;
  }

  // Caso contrário, só renderiza se houver algum valor no campo
  return this.mdValues.length > 0;
}


  // --------------------------------------------------
  // DOI FINAL PARA EXIBIÇÃO
  // --------------------------------------------------
  getItemDoiResolved(): { text: string; link: string } | null {
    const itemDoi = this.findDoiInItem();
    if (!itemDoi) {
      return null;
    }

    return {
      text: itemDoi.doi,
      link: `${itemDoi.baseUrl}${itemDoi.doi}`,
    };
  }

  // --------------------------------------------------
  // BUSCA DOI EM TODO O ITEM
  // --------------------------------------------------
  findDoiInItem(): { doi: string; baseUrl: string } | null {
    if (!this.parentItem) {
      return null;
    }

    // 1 dc.identifier.doi
    const doiField = this.parentItem.firstMetadataValue('dc.identifier.doi');
    if (doiField) {
      return this.parseDoiValue(doiField);
    }

    // 2 dc.identifier (pode conter DOI cru)
    const identifiers = this.parentItem.allMetadata('dc.identifier') || [];
    for (const id of identifiers) {
      const parsed = this.parseDoiValue(id.value);
      if (parsed) {
        return parsed;
      }
    }

    // 3 dc.identifier.uri (pode conter URL DOI)
    const uris = this.parentItem.allMetadata('dc.identifier.uri') || [];
    for (const uri of uris) {
      const parsed = this.parseDoiValue(uri.value);
      if (parsed) {
        return parsed;
      }
    }

    return null;
  }

  // --------------------------------------------------
  // INTERPRETA UM VALOR (URL DOI OU DOI CRU)
  // --------------------------------------------------
  parseDoiValue(value: string): { doi: string; baseUrl: string } | null {
    if (!value) {
      return null;
    }

    // URL DOI
    if (this.doiUrlRegex.test(value)) {
      const baseUrl = value.match(this.doiUrlRegex)![0];
      return {
        doi: value.replace(this.doiUrlRegex, ''),
        baseUrl,
      };
    }

    // DOI cru (10.xxxx/...)
    if (this.rawDoiRegex.test(value)) {
      return {
        doi: value,
        baseUrl: 'https://doi.org/',
      };
    }

    return null;
  }


  resolveIdentifier(value: string): { text: string; link: string } | null {
    const parsed = this.parseDoiValue(value);
    if (!parsed) {
      return null;
    }

    return {
      text: parsed.doi,
      link: `${parsed.baseUrl}${parsed.doi}`,
    };
  }
}

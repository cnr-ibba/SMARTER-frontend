import { Component, Input, OnInit } from '@angular/core';

import { Sample, JSONObject, JSONValue } from '../../samples.model';

interface Link {
  id: JSONValue;
  url: JSONValue;
  key: string;
}

@Component({
  selector: 'app-sample-metadata',
  templateUrl: './sample-metadata.component.html',
  styleUrls: ['./sample-metadata.component.scss']
})
export class SampleMetadataComponent implements OnInit {
  @Input() sample!: Sample;
  links: Link[] = [];

  constructor() { }

  ngOnInit(): void {
    let metadata: JSONObject = this.sample.metadata;

    for (const [key, value] of Object.entries(metadata)) {
      // search for keys with a _url suffix
      if (key.search('url') > 0) {
        // search for keys with _id suffix but same prefix (ex. biosample_url -> biosample_id)
        let newkey = key.replace('_url', "_id");

        if (metadata.hasOwnProperty(newkey)) {
          // if I find both keys, track in links array
          this.links.push({id: metadata[newkey], url: value, key: newkey})

          // remove links and keys from metadata attribute
          delete metadata[key];
          delete metadata[newkey];
        }
      }
    }

    this.sample.metadata = metadata;
  }

}

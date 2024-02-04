# Editor

## Options

| Option         | Type    | Default | Description                                                     |
| -------------- | ------- | ------- | --------------------------------------------------------------- |
| confirm_delete | boolean | 1       | Whether to show a confirmation message when deleting an object. |

## Initialisation

Once the configuration is set, the `init` method is called to initialise the Map:

```javascript
waymark_viewer.init(waymark_config);
```

The Map is now displayed on the page.

### Loading Data

Data can be loaded into the Map using the `load_json` method, which accepts a GeoJSON object as an argument.

```javascript
waymark_viewer.load_json({
  type: "FeatureCollection",
  features: [
    {
      geometry: { type: "Point", coordinates: [-85.038, 49.4595] },
      type: "Feature",
      properties: { type: "food" },
    },
  ],
});
```

### Retrieving Data

```javascript
//Map Data
var map_data_string = JSON.stringify(Waymark.map_data.toGeoJSON());
console.log(map_data_string);
```

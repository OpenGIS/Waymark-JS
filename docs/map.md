# Map Instances

Maps can either be read-only using the Viewer, or editable using the Editor. Both the Viewer and Editor extend the `Waymark_Map` class.

Multiple maps can be used on a single page, each with their own configuration. A single Map is known as an Instance and is created using the `Waymark_Map_Factory` which is attached to the `window` object.

For example, to create a new (read-only) Instance:

```javascript
// This Waymark_Map_Viewer Instance extends Waymark_Map class
const waymark_viewer = window.Waymark_Map_Factory.viewer();
```

#### Type Keys

When assigning a type to an Overlay, the `type` feature property must be the Key of the appropriate Type, which is generated from the Overlay `title`.

This is done by the `Waymark_Map.make_key()` method, which removes any non-alpha-numeric characters from the `title` and converts it to lowercase.

Waymark JS adds the Type Key to the Overlay container like this:

```html
<!-- "Beer" Marker with Font Icon       ***BEER*** -->
<div
  class="waymark-marker waymark-marker-beer waymark-marker-circle waymark-marker-small"
>
  <div class="waymark-marker-background" style="background:#70af00;"></div>
  <i
    style="color:#ffffff;"
    class="waymark-marker-icon waymark-icon-icon ion ion-beer"
  ></i>
</div>
```

You can use this to style specific Types in your CSS, for example:

```css
/* Adjust the "Beer" Marker Text Icon size */
.waymark-marker-beer .waymark-icon-text {
  font-size: 18px !important;
}
```

> [!TIP]
> The key for "A Much Longer Title" would be `amuchlongertitle`.

Use your browser’s inspector ([Firefox](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector/How_to/Open_the_Inspector) / [Chrome](https://developer.chrome.com/docs/devtools/open/)) to find Type keys.

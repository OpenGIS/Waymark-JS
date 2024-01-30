# Settings

## Misc

### Interaction Options

Interaction options are defined in the `interaction_options` object. The default options are shown below.

```javascript
var waymark_settings = {
  misc: {
    interaction_options: {
      delay_seconds: "2",
      do_message: "0",
      wake_message: "Click or Hover to Wake",
    },
  },
};
```

#### Interaction Option Options

| Option          | Description                                   |
| --------------- | --------------------------------------------- |
| `delay_seconds` | The delay in seconds before the Map wakes up. |
| `do_message`    | Whether the wake message is displayed.        |
| `wake_message`  | The wake message.                             |

### Cluster Options

Cluster options are defined in the `cluster_options` object. The default options are shown below.

```javascript
var waymark_settings = {
  misc: {
    cluster_options: {
      show_cluster: "1",
      cluster_threshold: "14",
      cluster_radius: "80",
    },
  },
};
```

#### Cluster Option Options

| Option              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `show_cluster`      | Whether Clusters are displayed.                   |
| `cluster_threshold` | The number of Markers required to form a Cluster. |
| `cluster_radius`    | The radius of the Cluster.                        |

## Overlay

### Properties

Properties are defined in the `properties` object. The default options are shown below.

```javascript
var waymark_settings = {
  overlay: {
    properties: { "": { property_key: "", property_title: "" } },
  },
};
```

#### Property Options

| Option           | Description         |
| ---------------- | ------------------- |
| `property_key`   | The property key.   |
| `property_title` | The property title. |

## Full Example

```javascript
var waymark_settings = {
  misc: {
    editor_options: { media_library_uploads: "1" },
    interaction_options: {
      delay_seconds: "2",
      do_message: "0",
      wake_message: "Click or Hover to Wake",
    },
    cluster_options: {
      show_cluster: "1",
      cluster_threshold: "14",
      cluster_radius: "80",
    },
  },
  overlay: {
    properties: { "": { property_key: "", property_title: "" } },
  },
};
```

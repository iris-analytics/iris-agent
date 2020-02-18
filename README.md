# Iris agent

This JavaScript library sends events data to [agent-backend](https://github.com/iris-analytics/iris-backend) to then be stored in [ClickHouse](https://clickhouse.yandex/).
You can define events as you wish (not only page loads) and send a custom payload with each of them.

- [Iris agent](#iris-agent)
  - [Install](#install)
  - [Usage](#usage)
  - [Extend it](#extend-it)
  - [Build it](#build-it)
  - [Example React Application](#example-react-application)
  - [Example HTML](#example-html)

## Install

```bash
npm install iris-agent
```
or 
```bash
yarn add iris-agent
```

## Usage

Once the library is loaded (@todo info about how to load it using different include methods, in the meanwhile check [./example folder](./example) you must init the library this way:

```js
<script>
    Iris.init('ACCOUNT_ID', CONFIG);
</script>
```

Where:

- `ACCOUNT_ID` is a string to help you group all events happening for a given user defined domain. This can be a domain, a group of domains, a TLD, etc.
- `CONFIG` is a configuration object that contains the following settings:
  - `cookiePrefix` (optional, string): this library stores cookies to identify user and sessions. You can costumize the string prepended to the name of these cookies.
  - `targetUrl` (optional, string): The uri of `iris-backend` (or any proxy you might have in between)
  - `useBeacon` (optional, bool): this library will try to send data using beacons by default. If this functionality is not available, it will fall back to transparent hidden pixel. Setting this value to `false` it will always use the fallback (pixel) method.

Example:

```js
  <script>
    Iris.init(
        'XXX-ACCOUNT',
        {
            targetUrl: "http://iris-backend/recordevent.gif", cookiePrefix: "_foo",
            useBeacon: true
        });
  </script>
```

Once the library has been loaded and initted, you can use them using the `fire` method:

```js
<script>
    Iris.fire('EVENT_NAME', EVENT_DATA);
</script>
```

Where:

- `EVENT_NAME` (string): is the name of your event, such as `pageload`, `button_clicked`, etc.
- `EVENT_DATA` (optional, misc): is the data you can attach to any event, like `{"customer_id":123}` or `{"AB_TEST_FOO_VERSION":"A"}`, it's up to you. However, it is a good idea to send JavaScript objects since these will be serialized as JSON. Once in `ClickHouse` it's easy to do queries that read JSON values.

Example:

```js
<script>
    Iris.fire('pageview');
    Iris.fire('button_clicked', {text: "apply now!"});
</script>
```

## Extend it

This assumes you have `yarn` installed.

```bash
yarn install
yarn development
```

## Build it

```bash
yarn build
```

## Example React Application

```bash
yarn example
```

## Example HTML

```bash
yarn example:html
```

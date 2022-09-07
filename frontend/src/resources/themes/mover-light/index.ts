import settings from "resources/settings";

// Configure the Google Maps integration.

// Not that the map IDs may be customized here:
// https://console.cloud.google.com/google/maps-apis/studio/styles/270c370d55050985?project=maps-ext-68143585

settings.integrations.googleMaps.parameters.mapIds = ["a3e3799fd01fa72e"];
settings.integrations.googleMaps.defaults!.mapId = "a3e3799fd01fa72e";

settings.integrations.legacyGoogleMaps.mapStyleName = "roadmap-light";

// To parse this data:
//
//   import { Convert, PoderSolar } from "./file";
//
//   const poderSolar = Convert.toPoderSolar(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface PoderSolar {
    estado: boolean;
    msj:    string;
    data:   Datos;
}

export interface Datos {
    effect_changes:      any[];
    effect_entries:      EffectEntry[];
    flavor_text_entries: FlavorTextEntry[];
    generation:          Generation;
    id:                  number;
    is_main_series:      boolean;
    name:                string;
    names:               Name[];
    pokemon:             Pokemon[];
}

export interface EffectEntry {
    effect:       string;
    language:     Generation;
    short_effect: string;
}

export interface Generation {
    name: string;
    url:  string;
}

export interface FlavorTextEntry {
    flavor_text:   string;
    language:      Generation;
    version_group: Generation;
}

export interface Name {
    language: Generation;
    name:     string;
}

export interface Pokemon {
    is_hidden: boolean;
    pokemon:   Generation;
    slot:      number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toPoderSolar(json: string): PoderSolar {
        return cast(JSON.parse(json), r("PoderSolar"));
    }

    public static poderSolarToJson(value: PoderSolar): string {
        return JSON.stringify(uncast(value, r("PoderSolar")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "PoderSolar": o([
        { json: "estado", js: "estado", typ: true },
        { json: "msj", js: "msj", typ: "" },
        { json: "data", js: "data", typ: r("Data") },
    ], false),
    "Data": o([
        { json: "effect_changes", js: "effect_changes", typ: a("any") },
        { json: "effect_entries", js: "effect_entries", typ: a(r("EffectEntry")) },
        { json: "flavor_text_entries", js: "flavor_text_entries", typ: a(r("FlavorTextEntry")) },
        { json: "generation", js: "generation", typ: r("Generation") },
        { json: "id", js: "id", typ: 0 },
        { json: "is_main_series", js: "is_main_series", typ: true },
        { json: "name", js: "name", typ: "" },
        { json: "names", js: "names", typ: a(r("Name")) },
        { json: "pokemon", js: "pokemon", typ: a(r("Pokemon")) },
    ], false),
    "EffectEntry": o([
        { json: "effect", js: "effect", typ: "" },
        { json: "language", js: "language", typ: r("Generation") },
        { json: "short_effect", js: "short_effect", typ: "" },
    ], false),
    "Generation": o([
        { json: "name", js: "name", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], false),
    "FlavorTextEntry": o([
        { json: "flavor_text", js: "flavor_text", typ: "" },
        { json: "language", js: "language", typ: r("Generation") },
        { json: "version_group", js: "version_group", typ: r("Generation") },
    ], false),
    "Name": o([
        { json: "language", js: "language", typ: r("Generation") },
        { json: "name", js: "name", typ: "" },
    ], false),
    "Pokemon": o([
        { json: "is_hidden", js: "is_hidden", typ: true },
        { json: "pokemon", js: "pokemon", typ: r("Generation") },
        { json: "slot", js: "slot", typ: 0 },
    ], false),
};

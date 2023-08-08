import test from 'ava';
import { createCombinatorRenderInfos } from '../../src/util/combinators';
import { ControlElement } from '../../src';

const rootSchema = {
  type: 'object',
  properties: {
    widget: {
      anyOf: [
        {
          $ref: '#/definitions/Dua',
        },
        {
          $ref: '#/definitions/Lipa',
        },
      ],
    },
  },
  definitions: {
    Dua: {
      title: 'Dua',
      type: 'object',
      properties: { name: { type: 'string' } },
    },
    Lipa: {
      title: 'Lipa',
      type: 'object',
      properties: { name: { type: 'string' } },
    },
  },
};

const rootSchemaWithOverrides = {
  ...rootSchema,
  properties: {
    ...rootSchema.properties,
    widget: {
      ...rootSchema.properties.widget,
      anyOf: [
        {
          ...rootSchema.properties.widget.anyOf[0],
          title: 'DuaOverride',
        },
        {
          ...rootSchema.properties.widget.anyOf[1],
          title: 'LipaOverride',
        },
      ],
    },
  },
};

const control: ControlElement = {
  type: 'Control',
  scope: '#',
};

test('createCombinatorRenderInfos - uses titles for labels when subschemas are refs', (t) => {
  const [duaRenderInfo, lipaRenderInfo] = createCombinatorRenderInfos(
    rootSchema.properties.widget.anyOf,
    rootSchema,
    'anyOf',
    control,
    'widget',
    []
  );
  t.deepEqual(duaRenderInfo.label, 'Dua');
  t.deepEqual(lipaRenderInfo.label, 'Lipa');
});

test('createCombinatorRenderInfos - uses overrides for labels when subschemas are refs', (t) => {
  const [duaRenderInfo, lipaRenderInfo] = createCombinatorRenderInfos(
    rootSchemaWithOverrides.properties.widget.anyOf,
    rootSchemaWithOverrides,
    'anyOf',
    control,
    'widget',
    []
  );
  t.deepEqual(duaRenderInfo.label, 'DuaOverride');
  t.deepEqual(lipaRenderInfo.label, 'LipaOverride');
});

import { createElement } from 'react'
import { addons, types } from 'storybook/manager-api'
import { DataPanelTab } from './data-panel'
import { racktrackTheme } from './theme'

addons.setConfig({ theme: racktrackTheme })

// "Data" tab beside Controls / Actions / Code; stories opt in with
// `parameters.sampleData`.
addons.register('racktrack/data', () => {
  addons.add('racktrack/data/panel', {
    type: types.PANEL,
    title: 'Data',
    render: ({ active }) => createElement(DataPanelTab, { active: !!active }),
  })
})

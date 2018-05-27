jest.mock('../../dao/njt-schedule-dao')
jest.mock('../../globals')

import * as NJTScheduleManager from '../njt-schedule-manager'
import * as moment from 'moment'

describe('getScheduleFromNJTPage', () => {
  it('should return schedule results (with no transfers)', async () => {
    const schedule = await NJTScheduleManager.getScheduleFromNJTPage(
      'Millburn',
      'some_id',
      'New York Penn Station',
      'some_id',
      moment()
    )
    expect(schedule).toMatchSnapshot()
  })

  it('should return schedule results (with transfers)', async () => {
    const schedule = await NJTScheduleManager.getScheduleFromNJTPage(
      'Aberdeen Matawan',
      'some_id',
      'Allenhurst',
      'some_id',
      moment()
    )
    expect(schedule).toMatchSnapshot()
  })
})

import { Feature } from 'toolkit/extension/features/feature';
import { getSelectedMonth } from 'toolkit/extension/utils/ynab';
import { handleBudgetBreakdownAvailableBalance } from './budget-breakdown-available-balance';
import { handleBudgetBreakdownMonthlyTotals } from './budget-breakdown-monthly-totals';
import { handleBudgetTableRows } from './budget-table-row';
import { setCategoriesObject } from './categories';
import * as destroyHelpers from './destroy-helpers';
import { isClassInChangedNodes } from 'toolkit/extension/utils/helpers';
import { isCurrentRouteBudgetPage } from 'toolkit/extension/utils/ynab';

export class SubtractUpcomingFromAvailable extends Feature {
  shouldInvoke() {
    return isCurrentRouteBudgetPage();
  }

  observe(changedNodes) {
    if (!this.shouldInvoke()) return;

    if (isClassInChangedNodes('budget-inspector-button', changedNodes)) {
      handleBudgetBreakdownAvailableBalance();
      handleBudgetBreakdownMonthlyTotals();
    }
    if (isClassInChangedNodes('budget-table-row', changedNodes)) {
      setCategoriesObject();
      handleBudgetTableRows();
    }
  }

  invoke() {}

  destroy() {
    destroyHelpers.resetInspectorMessage();
    destroyHelpers.removeBudgetBreakdownEntries();
    destroyHelpers.resetCategoryValues();
  }
}

export function shouldRun() {
  // Upcoming transactions can only exist in current or future months.
  const selectedMonth = getSelectedMonth();
  const currentMonth = ynab.utilities.DateWithoutTime.createForCurrentMonth();
  return !selectedMonth.isBeforeMonth(currentMonth);
}

import { Page, expect } from '@playwright/test';
import { config } from '../test_config/testConfig';
import { delay, compareDate } from '../test_config/utils';

const selectors = {
    btnSearch: '//button[@type="submit" and text()="Search"]',
    txtNoData: '//h5[text()="No Data"]',   
};

class Common {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    };
}

export { Common, selectors };
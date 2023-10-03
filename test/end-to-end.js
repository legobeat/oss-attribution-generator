const path = require('path');
const assert = require('assert');
const fs = require('fs');
const { execSync } = require('child_process');


describe('end to end', () => {

    let licenseInfos;
    before(() => {
        execSync('npm install', {
            cwd: path.join(__dirname, "fixture"),
        });
        execSync(path.join(__dirname, '../index.js'), {
            cwd: path.join(__dirname, 'fixture'),
        });

        licenseInfos = JSON.parse(fs.readFileSync(
            path.join(__dirname, './fixture/oss-attribution/licenseInfos.json')
        ).toString());
    });

    it('outputs licenseInfos in object format', () => {
        assert('angular' in licenseInfos);
    });

    it('excludes devDependencies', () => {
        assert(!('@angular-devkit/build-angular' in licenseInfos));
    });

    it('includes transitive dependencies', () => {
        assert('tslib' in licenseInfos);
    });

    it('returns a particular structure', () => {
        for (const item of Object.values(licenseInfos)) {
            for (const key of ['name', 'version', 'authors', 'license', 'licenseText', 'url']) {
                if (item.name !== 'uuid' || key !== 'authors') {
                    assert(key in item, `Expected ${key} for ${item['name']}`);
                }
            }
        }
    });

    it('returns the correct data for rxjs', () => {
        const rxjs = licenseInfos.rxjs;
        assert(rxjs.version === '6.6.7');
        assert(rxjs.authors === 'Ben Lesh <ben@benlesh.com>');
        assert(rxjs.license === 'Apache-2.0');
        assert(rxjs.licenseText.includes('Apache License'));
        assert(rxjs.url === 'https://github.com/reactivex/rxjs');
    });
});

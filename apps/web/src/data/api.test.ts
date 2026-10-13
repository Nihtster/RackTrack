import { describe, expect, it } from 'vitest';
import { api } from './api';

const base = { date: '2026-10-13', firearmId: '1', location: 'Indoor Range' };

describe('api.logSession', () => {
  it('records the session and takes the rounds out of the named ammo', async () => {
    const [stock] = await api.ammo();
    const before = (await api.sessions()).length;

    const session = await api.logSession({ ...base, loads: [{ ammoId: stock.id, rounds: 10 }] });

    expect(session.id).toBeTruthy();
    expect(session.rounds).toBe(10);
    expect((await api.sessions()).length).toBe(before + 1);
    expect((await api.ammo()).find((a) => a.id === stock.id)?.onHand).toBe(stock.onHand - 10);
  });

  it('splits a mixed session across each ammo it used', async () => {
    const [a, b] = await api.ammo();
    const session = await api.logSession({
      ...base,
      loads: [
        { ammoId: a.id, rounds: 5 },
        { ammoId: b.id, rounds: 7 },
      ],
    });

    expect(session.rounds).toBe(12);
    const after = await api.ammo();
    expect(after.find((s) => s.id === a.id)?.onHand).toBe(a.onHand - 5);
    expect(after.find((s) => s.id === b.id)?.onHand).toBe(b.onHand - 7);
  });

  it('drops loads of zero rounds', async () => {
    const [a, b] = await api.ammo();
    const session = await api.logSession({
      ...base,
      loads: [
        { ammoId: a.id, rounds: 3 },
        { ammoId: b.id, rounds: 0 },
      ],
    });
    expect(session.loads).toEqual([{ ammoId: a.id, rounds: 3 }]);
  });

  it('logs rounds without ammo when none is named', async () => {
    const session = await api.logSession({ ...base, loads: [{ rounds: 20 }] });
    expect(session.rounds).toBe(20);
  });

  it('never takes stock below zero', async () => {
    const stock = (await api.ammo()).find((a) => a.onHand > 0)!;
    await api.logSession({ ...base, loads: [{ ammoId: stock.id, rounds: stock.onHand + 500 }] });
    expect((await api.ammo()).find((a) => a.id === stock.id)?.onHand).toBe(0);
  });

  it('rejects empty, negative and fractional sessions', async () => {
    for (const loads of [[], [{ rounds: 0 }], [{ rounds: -5 }], [{ rounds: 2.5 }]]) {
      await expect(api.logSession({ ...base, loads })).rejects.toThrow(/whole number/);
    }
  });

  it('hands out copies, so a later write is a new value to read', async () => {
    const first = await api.sessions();
    await api.logSession({ ...base, loads: [{ rounds: 1 }] });
    const second = await api.sessions();
    expect(second).not.toBe(first);
    expect(second.length).toBe(first.length + 1);
  });
});

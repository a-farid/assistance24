'use client';

import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import {useTransition} from 'react';
import {Locale} from '@/i18n/config';
import {setUserLocale} from '@/services/locale';
import { Check, Globe } from 'lucide-react';
import { useTheme } from "next-themes";

type Props = {
  defaultValue: string;
  items: Array<{value: string; label: string}>;
  label: string;
};

export default function LocaleSwitcherSelect({defaultValue, items, label }: Props) {
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();


  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => { setUserLocale(locale)});
  }

  return (
    <div className="relative mx-3 ">
      <Select.Root defaultValue={defaultValue} onValueChange={onChange}>
        <Select.Trigger aria-label={label}
          className={clsx('rounded-sm p-2 transition-colors', isPending && 'pointer-events-none opacity-60')}>
          <Select.Icon>
            {theme === "light" ?
            (<Globe  className='hover:bg-blue cursor-pointer z-20' fill="black"/>) :
            (<Globe  className='hover:bg-blue cursor-pointer z-20'/>)}
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content align="end" className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md mt-5" position="popper">
            <Select.Viewport>
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100 "
                  value={item.value}
                >
                  <div className="mr-2 w-[1rem]">
                    {item.value === defaultValue && (<Check className="h-5 w-5 text-slate-600" />)}
                  </div>
                  <span className="text-slate-900">{item.label}</span>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.Arrow className="fill-white text-white" />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

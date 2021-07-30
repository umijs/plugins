import dayjs from '{{{dayjsPath}}}';
import antdPlugin from 'antd-dayjs-webpack-plugin/src/antd-plugin';

{{#plugins}}
import {{.}} from 'dayjs/plugin/{{.}}';
{{/plugins}}

{{#plugins}}
dayjs.extend({{.}});
{{/plugins}}

dayjs.extend(antdPlugin);

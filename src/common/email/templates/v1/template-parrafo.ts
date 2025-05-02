export const parrafo_TR = ({ content, style = '' }: { content: string; style?: string }): string => `
    <tr>
        <td>
            <table style="${style}; margin: 10px 0px; text-align: justify;">
                <tr>
                    <td>
                        ${content}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`;
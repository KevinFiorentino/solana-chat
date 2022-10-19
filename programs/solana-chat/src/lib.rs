use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_chat {
    use super::*;
    pub fn create_message(
        ctx: Context<CreateMessage>,
        text: String
    ) -> Result<()> {

        let message = &mut ctx.accounts.message;
        message.owner = ctx.accounts.user.key();
        message.text = text;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(text: String)]
pub struct CreateMessage<'info> {

    #[account(
        init,
        payer = user,
        seeds = [
            b"create_message",
            user.key().as_ref(),
            text.as_bytes()
        ],
        bump,
        space = 8  +                             // Discriminator Anchor
                32 +                             // Owner
                text.as_bytes().len() + 4        // Text + 4
    )]
    pub message: Account<'info, Message>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct Message {
    pub owner: Pubkey,    // 32
    pub text: String,     // n + 4
}
